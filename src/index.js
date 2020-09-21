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
const UserService = require('../src/Application/Services/UserService');
const MongoUserRepository = require('../src/Frameworks/Persistance/DB/MongoUserRepository');

const NoteService = require('../src/Application/Services/NoteService');
const MongoNoteRepository = require('../src/Frameworks/Persistance/DB/MongoNoteRepository');
const { createCipher } = require('crypto');

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
  const userId = req.user;
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);
  try {
    const user = userService.getMe(userId);
    return res.status(200).json(user);
  } catch(err) {
    console.log(`Something went wrong in getMe at index levet ${err}`);
    return res.status(500).json({message: `Something went wrong. Plese try it again.`});
  }
});

app.post('/updateme', auth, async (req, res) => {
  const userID = req.user;
  var newUser = req.body;
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);
  try {
    var user = await userService.updateUser(userID, newUser);
    return res.status(200).json({success: `Succesfully Updated Profile`, user});
  } catch(err) {
    console.log(`Something went wrong while updating the profile: ${err}`);
    return res.status(500).json({failure: `Something went wrong while updating the profile`, user});
  }
});

// Register new User.
app.post('/signup', async (req, res) => {
  var newUser = {};
  newUser.userName = req.body.userName;
  newUser.pwd = await getHashed(req.body.password);
  newUser.email = req.body.email;
  newUser.description = '';
  newUser.token = '';
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);

  try{
    var user = await userService.createUser(newUser);
    res.cookie('token', user.token,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: false,
        secure: false,
      });
    res.cookie('tokenClient', user.tokenClient,
      {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
      });
    return res.status(201)
        .json({success: `${ret.insertedCount} User created.`, user});
  } catch(err) {
    return res.status(400).json({error: `User can't be created.`});
  }
});

app.post('/login', async (req, res) => {
  const {userName, password} = req.body;
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);
  console.log("LOGIN");
  try {
    const user = await userService.login({username: userName, pwd: password});
    res.cookie('token', user.token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: false,
        secure: false,
    });
    res.cookie('tokenClient', user.tokenClient, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
    });

    return res.status(200).json({success: 'Succesfully Logged In', user});
  } catch(err) {
    console.log("error ", err);
    return res.status(400).json({message: 'Something went wrong.'});
  }
  
});

// Unlock pwd for pwd update in profile
app.post('/unlockpwd', auth, async(req, res) => {
  var userID = req.user;
  var sentPWD = req.body.currentPassword;
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);
  try {
    const isUnlocked = await userService.unlockPwd({userID, sentPWD});
    var returnObj;
    if(isUnlocked) {
      returnObj = {success: 'success'};
      return res.status(200).json(returnObj)
    } else {
      returnObj = {failure: 'Provided pwd is wrong!'};
      return res.status(401).json(returnObj)
    }
  } catch(err) {
    return res.status(500).json({message: 'Something went wrong while unlocking password section. Please try again.'});
  }
  // var savedPWD = await db.collection(collectionName).findOne({_id: ObjectID(userID)});
  // var result = await validateUser(sentPWD, savedPWD.pwd);
})

// Logout
app.post('/logout', auth, async(req, res) => {
  const userId = req.user;
  let userRepository = new MongoUserRepository();
  await userRepository.connect();
  let userService =  new UserService(userRepository);
  try {
    var result = await userService.logout(userId);
    res.cookie('token', {expires: Date.now()});
    return res.status(200).json({message: 'Logout successfully.'});
  } catch(err) {
    console.log(`Something went wrong while logging out. ${err}`);
    return res.status(400).json({message: 'Something went wrong while logging out.'});
  }
});

// Notes
app.get('/notes', auth, async (req, res) => {
  console.log("NOTES GET");
  var userID = req.user;
  let noteRepository = new MongoNoteRepository();
  await noteRepository.connect();
  let noteService =  new NoteService(noteRepository);
  try {
    const notes = await noteService.getAllNotes(userID);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Something went wrong while fetching notes. Please try again. ${err}`);
    return res.status(500).json({message: 'Something went wrong while fetching notes. Please try again.'});
  }
});

// update Note
app.post('/updateNote', auth, async(req, res) => {
  var id = req.user;
  var updateNote = {};
  updateNote._id = req.body._id;
  updateNote.x = req.body.initialx;
  updateNote.y = req.body.initialy;
  updateNote.title = req.body.title;
  updateNote.type = req.body.type;
  updateNote.note = req.body.note;
  updateNote.height = req.body.height;
  updateNote.width = req.body.width;

  var userID = req.user;
  let noteRepository = new MongoNoteRepository();
  await noteRepository.connect();
  let noteService =  new NoteService(noteRepository);

  try {
    await noteService.updateNote(userID, updateNote);
  } catch(err) {
    console.log(`Error while updating note at index. ${err}`);
  }
  
  try {
    const notes = await noteService.getAllNotes(id);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
  }
  
});

// Add notes
app.post('/addNote', auth, async(req, res) => {
  const userId = req.user;
  const {type, title, note, x, y, width, height } = req.body;
  let noteRepository = new MongoNoteRepository();
  await noteRepository.connect();
  let noteService =  new NoteService(noteRepository);
  try {
    await noteService.createnote(userId, {type, title, note, x, y, width, height});
  } catch(err) {
    console.log(`Error while adding new note. ${err}`);
  }
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  try {
    const notesReturn = await noteService.getAllNotes(userId);
    return res.status(200).json({message: 'Notes successfull', notesReturn});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }

});

app.get('/deleteNote/:noteID', auth, async(req, res) => {
  const userId = req.user;

  var noteId = req.params.noteID;
  let noteRepository = new MongoNoteRepository();
  await noteRepository.connect();
  let noteService =  new NoteService(noteRepository);
  try {
    await noteService.deleteNote(userId, noteId);
  } catch(err) {
    console.log(`Error while deleting note at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  try {
    const notesReturn = await noteService.getAllNotes(userId);
    return res.status(200).json({message: 'Notes successfull', notesReturn});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
  
});

const getHashed = async (pwd) => {
  console.log("GET HASHED PWD: ", pwd);
  const hashedPwd = await bcrypt.hash(pwd, 8);
  console.log("HASED PWD: ", hashedPwd);
  return hashedPwd;
};


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
