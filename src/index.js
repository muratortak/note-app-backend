const express = require('express');
const app = require('express')();
const client = require('mongodb').MongoClient;
const assert = require('assert');
const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017';
const dbName = 'dashboard';
const collectionName = 'Users';
const connectionOptions = {poolSize: process.env.MONGO_POOLSIZE || 1};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const auth = require('./middleware/auth');
const ObjectID = require('mongodb').ObjectID;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// app.use(express.json());
app.use(express.json({limit: '10mb'}));
var corsOptions = {
  origin: 'http://localhost:3001', 
  credentials: true
  // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(cookieParser());
// app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));


let db;
client.connect(url, connectionOptions, (err, database) => {
  if (err) throw new Error(err);
  console.log('DB is connected.');
  db = database.db(dbName);
});

// get a User's info.
app.post('/me', auth, async (req, res) => {
  const user =
    await db.collection(collectionName).findOne({_id: new ObjectID(req.user)});
  // TODO: Find a better way to validate whether user exists or not.
  // console.log("ANS, ", ans);
  console.log('ANS IN ME: ', user, user.length);
  return res.status(200).json(user);
  // return res.status(404).json({message: 'User Not Found'});
});

app.post('/updateme', auth, async (req, res) => {
  const userID = req.user;
  console.log("USERID: ", userID);
  console.log("USERNAME BODY: " + req.body.username);
  console.log("PASSWORD BODY: " + req.body.newPassword);
  var newUser = req.body;
  Object.keys(newUser).forEach((key) => (newUser[key] == null || newUser[key].trim() == '') && delete newUser[key]);
  console.log("NEW USER OBJ: ", newUser);
  if(newUser.pwd !== undefined) {
    newUser.pwd = await getHashed(newUser.pwd);
    console.log("UPDATE ME: PWD: " + newUser.pwd + " NEW USERNAME: " + newUser.userName + " IMAGE:", newUser.image)
  }
  user = await db.collection(collectionName)
  .findOneAndUpdate(
      {_id: new ObjectID(userID)},
      {$set: newUser},
      {returnOriginal: false},
  );
  console.log("RETURN USER ON UPDATE: ", user.value);
  var user = user.value;
  return res.status(200).json({success: 'Succesfully Updated Profile', user});
});

// Register new User.
app.post('/signup', async (req, res) => {
  console.log("SIGNUP");
  const newUser = {};
  newUser.userName = req.body.userName;
  newUser.pwd = await getHashed(req.body.password);
  newUser.email = req.body.email;
  newUser.description = '';
  newUser.token = '';
  // TODO: Hash the pwd.
  const ret = await db.collection(collectionName).insertOne(newUser);
  
  console.log('ret ops ', ret.ops);
  if (ret.result.n === 1 && ret.result.ok === 1) {
    var user = ret.ops[0];
    const {token, tokenClient} = await getToken(user._id);
    user = await db.collection(collectionName)
        .findOneAndUpdate(
            {_id: new ObjectID(user._id)},
            {$set: {token: tokenClient}},
            {returnOriginal: false},
        );
    user = user.value;

    res.cookie('token', token,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: false,
        secure: false,
      });
  res.cookie('tokenClient', tokenClient,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
      });
    return res.status(201)
        .json({success: `${ret.insertedCount} User created.`, user});
  }
  return res.status(400).json({error: `User can't be created.`});
});

app.post('/login', async (req, res) => {
  const username = req.body.userName;
  const pwd = req.body.password;
  let user = await db.collection(collectionName).findOne({userName: username});
  
  if(user === null) {
    return res.status(400).json({message: 'Login credentials are wrong!'});
  }
  
  const isValid = await validateUser(pwd, user.pwd);

  if (!isValid) {
    return res.status(400).json({message: 'Login credentials are wrong!'});
  }
  const {token, tokenClient} = await getToken(user._id);
  user = await db.collection(collectionName)
      .findOneAndUpdate(
          {_id: new ObjectID(user._id)},
          {$set: {token: tokenClient}},
          {returnOriginal: false},
      );
  user = user.value;
  res.cookie('token', token,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: false,
        secure: false,
      });
  res.cookie('tokenClient', tokenClient,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
      });

      console.log("USer right before sending back: ", user);

  return res.status(200).json({success: 'Succesfully Logged In', user});
});

// Unlock pwd for pwd update in profile
app.post('/unlockpwd', auth, async(req, res) => {
  var userID = req.user;
  var sentPWD = req.body.currentPassword;
  // var getHashedPWD = await getHashed(sentPWD);
  var savedPWD = await db.collection(collectionName).findOne({_id: ObjectID(userID)});
  console.log("SENT PWD: ", sentPWD);
  console.log("SAVED PWD: ", savedPWD.pwd);
  var result = await validateUser(sentPWD, savedPWD.pwd);
  console.log("RESULT OF VALIDATION: ", result);
  if(result) {
    var returnObj ={success: 'success'};
    return res.status(200).json(returnObj)
  }
  return res.status(401).json({message: 'Provided pwd is wrong!'});
})

// Logout
app.post('/logout', auth, async(req, res) => {
  await db.collection(collectionName)
      .findOneAndUpdate(
          {_id: new ObjectID(req.user)},
          {$set: {token: null}},
          {returnOriginal: false},
      );
  res.cookie('token', {expires: Date.now()});
  return res.status(200).json({message: 'Logout successfully.'});
});

// Notes
app.get('/notes', auth, async (req, res) => {
  console.log('get all notes');
  const userId = req.user;
  const notes = await db.collection('Notes')
      .findOne({userId: new ObjectID(userId)});
  const notesReturn = notes === null ? notes.notes : null;
  return res.status(200).json({message: 'Notes successfull', notesReturn});
});

// update location
app.post('/savelocation', auth, async(req, res) => {
  console.log('req, ', req.user);
  var id = req.user;
  var noteId = req.body.noteID;
  console.log('req note, ', new ObjectID(noteId));
  var x = req.body.x;
  var y = req.body.y;
  const noteObject = await db.collection('Notes').findOne({userId: new ObjectID(id)});

  await db.collection('Notes').updateOne(
    {
      userId: new ObjectID(id)
    },
    {
      $set: { "notes.$[elem].x": x, "notes.$[elem].y": y }
    },
    {
      arrayFilters: [{"elem._id": new ObjectID(noteId)}]
    }
  )
  
  // return res.status(200).json({message: 'Notes successfull', noteObject});
  
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  const notes = await db.collection('Notes')
      .findOne({userId: new ObjectID(id)});
  const notesReturn = notes.notes;
  console.log("note returns in add new note: ", notesReturn);
  return res.status(200).json({message: 'Notes successfull', notesReturn});
});

// update Note
app.post('/updateNote', auth, async(req, res) => {
  var id = req.user;
  var noteId = req.body._id;
  var updateNote = {};
  updateNote.x = req.body.initialx;
  updateNote.y = req.body.initialy;
  updateNote.title = req.body.title;
  updateNote.type = req.body.type;
  updateNote.note = req.body.note;
  updateNote.height = req.body.height;
  updateNote.width = req.body.width;

  const noteObject = await db.collection('Notes').findOne({userId: new ObjectID(id)});
  
  console.log("REQUEST BODY : ", req.body);
  console.log("UPDATENOTE : ", updateNote);
  await db.collection('Notes').updateOne(
    {
      userId: new ObjectID(id)
    },
    {
      $set: 
      { 
        "notes.$[elem].title": updateNote.title,
        "notes.$[elem].type": updateNote.type,
        "notes.$[elem].note": updateNote.note,
        "notes.$[elem].width": updateNote.width,
        "notes.$[elem].height": updateNote.height,
        "notes.$[elem].x": updateNote.x,
        "notes.$[elem].y": updateNote.y,
      }
    },
    {
      arrayFilters: [{"elem._id": new ObjectID(noteId)}]
    }
  )
  
  // return res.status(200).json({message: 'Notes successfull', noteObject});
  
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  const notes = await db.collection('Notes')
      .findOne({userId: new ObjectID(id)});
  const notesReturn = notes.notes;
  console.log("note returns in add new note: ", notesReturn);
  return res.status(200).json({message: 'Notes successfull', notesReturn});
});

// Add notes
app.post('/addNote', auth, async(req, res) => {
  const userId = req.user;
  console.log('user id in add note: ', userId);
  const {type, title, note, x, y, width, height } = req.body; 
  console.log('title in add note: ', title);
  const notes = await db.collection('Notes')
      .findOne({userId: new ObjectID(userId)});
      
  if(notes !== null)
  {
    await db.collection('Notes')
    .findOneAndUpdate(
      {userId: new ObjectID(userId)},
      {
        $push: { notes: { _id: new ObjectID(), type, title, note, x, y, width, height }, }
      },
      {returnOriginal: false},
      )
  } else {
    createNotes(userId,req.body)
  }
  
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  const returnNotes = await db.collection('Notes')
      .findOne({userId: new ObjectID(userId)});
  const notesReturn = returnNotes.notes;
  console.log("note returns in add new note: ", notesReturn);
  return res.status(200).json({message: 'Notes successfull', notesReturn});
});

app.get('/deleteNote/:noteID', auth, async(req, res) => {
  const userId = req.user;

  var noteId = req.params.noteID;
  console.log("Note id in delete note: ", noteId);
  await db.collection('Notes').update(
    {
      userId: new ObjectID(userId)
    },
    {
      $pull: { notes: { _id: new ObjectID(noteId)} }
    });
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  const notes = await db.collection('Notes')
    .findOne({userId: new ObjectID(userId)});
  const notesReturn = notes.notes;
  console.log("note returns in add new note: ", notesReturn);
  return res.status(200).json({message: 'Notes successfull', notesReturn});
  
});

app.put('/note', auth, (req, res) => {
  const userId = req.user;

});

const getHashed = async (pwd) => {
  console.log("GET HASHED PWD: ", pwd);
  const hashedPwd = await bcrypt.hash(pwd, 8);
  console.log("HASED PWD: ", hashedPwd);
  return hashedPwd;
};

const validateUser = async (pwd, hash) => {
  // console.log("validateUser: ", pwd, hash);
  return await bcrypt.compare(pwd, hash);
};

// create auth token
const getToken = async (id) => {
  const token = jwt.sign(
      {_id: id},
      'thisisthetoken',
      {expiresIn: '7 days'},
  );

  const tokenClient = jwt.sign(
      {_id: id},
      'thisistheClienttoken',
      {expiresIn: '7 days'},
  );
  // console.log(token);
  return {token, tokenClient};
};

// Verify the User's token.
const verifyToken = async (token, isClient = false) => {
  let verified;
  const clientTokenSalt = 'thisistheClienttoken';
  const tokenSalt = 'thisisthetoken';
  try {
    salt = (isClient) ? clientTokenSalt : tokenSalt;
    token = (isClient) ? token.tokenClient : token.token;
    verified = await jwt.verify(token, salt);
  } catch (err) {
    console.log(err);
  }
  return verified;
};


const createNotes = async (userId, newNote) => {
  let note = await db.collection('Notes').insertOne({_id: new ObjectID(), userId: new ObjectID(userId), notes:[{_id: new ObjectID(), type: newNote.type, title: newNote.title, note: newNote.note, x: newNote.x, y: newNote.y, width: newNote.width, height: newNote.height }]});
  console.log('note in createNotes: ', note);
  return note.ops[0]._id;
}

// const tok = getToken().then( res => {
//     verifyToken(res).then(tok => console.log('out token: ', tok));
// });
// console.log('token out: ', tok);
// console.log(tokenVerify);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
