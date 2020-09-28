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
const MongoUserRepository = require('../src/Frameworks/Persistance/DB/MongoUserRepository');
const UserDto = require('./Frameworks/DTO/UserDTO');
const UserDtoMapper = require('./Frameworks/DTO/Mapper/UserDtoMapper');
const SignupUser = require('../src/Application/UseCases/User/SignupUser');
const LoginUser = require('../src/Application/UseCases/User/LoginUser');
const LogoutUser = require('../src/Application/UseCases/User/LogoutUser');
const GetUser = require('../src/Application/UseCases/User/GetUser');
const UpdateUser = require('../src/Application/UseCases/User/UpdateUser');
const UnlockPWD = require('../src/Application/UseCases/User/UnlockPwd');

const MongoNoteRepository = require('../src/Frameworks/Persistance/DB/MongoNoteRepository');
const NoteDto = require('./Frameworks/DTO/NoteDTO');
const Note = require('./Entities/NoteEntity');
const NoteDtoMapper = require('./Frameworks/DTO/Mapper/NoteDtoMapper');
const UpdateNote = require('../src/Application/UseCases/Note/UpdateNote');
const GetAllNotes = require('../src/Application/UseCases/Note/GetAllNotes');
const CreateNote = require('../src/Application/UseCases/Note/CreateNote');
const DeleteNote = require('../src/Application/UseCases/Note/DeleteNote');


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

// Register new User.
app.post('/signup', async (req, res) => {
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const signupUserCase = new SignupUser(new MongoUserRepository());
  try{
    var user = await signupUserCase.signupUser(persistantUser);
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
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const loginUserCase = new LoginUser(new MongoUserRepository());
  try {
    const user = await loginUserCase.loginUser(persistantUser);
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

// Logout
app.post('/logout', auth, async(req, res) => {
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const logoutUserCase = new LogoutUser(new MongoUserRepository());
  try {
    await logoutUserCase.logoutUser(persistantUser);
    res.cookie('token', {expires: Date.now()});
    return res.status(200).json({message: 'Logout successfully.'});
  } catch(err) {
    console.log(`Something went wrong while logging out. ${err}`);
    return res.status(400).json({message: 'Something went wrong while logging out.'});
  }
});

// get a User's info.
app.post('/me', auth, async (req, res) => {
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const getUserCase = new GetUser(new MongoUserRepository());
  try {
    const user = getUserCase.getUser(persistantUser);
    return res.status(200).json(user);
  } catch(err) {
    console.log(`Something went wrong in getMe at index levet ${err}`);
    return res.status(500).json({message: `Something went wrong. Plese try it again.`});
  }
});

app.post('/updateme', auth, async (req, res) => {
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const updateUserCase = new UpdateUser(new MongoUserRepository());
  try {
    var user = await updateUserCase.updateUser(persistantUser);
    return res.status(200).json({success: `Succesfully Updated Profile`, user});
  } catch(err) {
    console.log(`Something went wrong while updating the profile: ${err}`);
    return res.status(500).json({failure: `Something went wrong while updating the profile`, user});
  }
});

// Unlock pwd for pwd update in profile
app.post('/unlockpwd', auth, async(req, res) => {
  const userDtoMapper = new UserDtoMapper();
  const persistantUser = userDtoMapper.toPersistant(req.user, req.body);
  const unlockPWDCase = new UnlockPWD(new MongoUserRepository());
  try {
    const isUnlocked = await unlockPWDCase.unlockPWD(persistantUser);
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
})

// Notes
app.get('/notes', auth, async (req, res) => {
  console.log("NOTES GET");
  const noteDtoMapper = new NoteDtoMapper();
  const persistanNote = noteDtoMapper.toPersistant(req.user, req.body);
  var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
  try {
    const notes = await getAllNoteCase.getAllNotes(persistanNote);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Something went wrong while fetching notes. Please try again. ${err}`);
    return res.status(500).json({message: 'Something went wrong while fetching notes. Please try again.'});
  }
});

// update Note
app.post('/updateNote', auth, async(req, res) => {
  const noteDtoMapper = new NoteDtoMapper();
  const persistanNote = noteDtoMapper.toPersistant(req.user, req.body);
  
  var updateNoteCase = new UpdateNote(new MongoNoteRepository());
  try {
    await updateNoteCase.updateNote(persistanNote)
  } catch(err) {
    console.log(`Error while updating note at index. ${err}`);
  }
  
  var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
  try {
    const notes = await getAllNoteCase.getAllNotes(persistanNote);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
  }
  
});

// Add notes
app.post('/addNote', auth, async(req, res) => {
  const noteDtoMapper = new NoteDtoMapper();
  const persistanNote = noteDtoMapper.toPersistant(req.user, req.body);

  var createNoteCase = new CreateNote(new MongoNoteRepository());
  
  try {
    await createNoteCase.createNote(persistanNote);
  } catch(err) {
    console.log(`Error while adding new note. ${err}`);
  }
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
  try {
    const notes = await getAllNoteCase.getAllNotes(persistanNote);
    console.log("NOTES IN GET ALL NOTES IN ADD NOTE: ", notes);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }

});

app.get('/deleteNote/:noteID', auth, async(req, res) => {
  const noteDtoMapper = new NoteDtoMapper();
  const persistanNote = noteDtoMapper.toPersistant(req.user, {_id: req.params.noteID});
  console.log("PERSISTANT NOTE: ", persistanNote);
  var deleteNoteCase = new DeleteNote(new MongoNoteRepository());
  
  try {
    await deleteNoteCase.deleteNote(persistanNote);
  } catch(err) {
    console.log(`Error while deleting note at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
  // Return all the notes again.
  // TODO: Find a better way to only send the updated note and merge in the State on the front-end.
  var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
  try {
    const notes = await getAllNoteCase.getAllNotes(persistanNote);
    console.log("NOTES IN GET ALL NOTES IN ADD NOTE: ", notes);
    return res.status(200).json({message: 'Notes successfull', notes});
  } catch(err) {
    console.log(`Error while fetching notes after updating one at index level. ${err}`);
    return res.status(500).json({message: 'Something went wrong. Please try again.'});
  }
  
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
