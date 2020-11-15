const { OAuth2Client }      = require('google-auth-library');
const MongoUserRepository   = require('../../Infrastructure/Persistance/DB/MongoUserRepository');
const UserDtoMapper         = require('../../Infrastructure/DTO/Mapper/UserDtoMapper');
const SignupUser            = require('../../Application/UseCases/User/SignupUser');
const OAuthSignup           = require('../../Application/UseCases/User/OAuthSignup'); 
const GetUser               = require('../../Application/UseCases/User/GetUser');
const LoginUser             = require('../../Application/UseCases/User/LoginUser');
const OAuthLoginUser        = require('../../Application/UseCases/User/OAuthLoginUser');
const LogoutUser            = require('../../Application/UseCases/User/LogoutUser');
const UpdateUser            = require('../../Application/UseCases/User/UpdateUser');
const UnlockPWD             = require('../../Application/UseCases/User/UnlockPwd');

const MongoNoteRepository   = require('../../Infrastructure/Persistance/DB/MongoNoteRepository');
const CreateInitialNote     = require('../../Application/UseCases/Note/CreateInitialNote');
const Constants             = require('../../Infrastructure/Constants');


module.exports = {

    async signup(req, res) {
        const persistantUser = new UserDtoMapper().toPersistant(req.user, req.body);
        const signupUserCase = new SignupUser(new MongoUserRepository());
        const createInitialNote = new CreateInitialNote(new MongoNoteRepository());
        try {
          var user = await signupUserCase.signupUser(persistantUser);
          await createInitialNote.createInitialNote(user._id);
        
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
    },

    async login(req, res) {
      const persistantUser = new UserDtoMapper().toPersistant(req.user, req.body);
      const getUserCase = new GetUser(new MongoUserRepository());
      const loginUserCase = new LoginUser(new MongoUserRepository());
      try {
        const userFound = await getUserCase.getUserByName(persistantUser);
        const user = await loginUserCase.loginUser(persistantUser, userFound);
        
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

        res.cookie('isOAuth', user.isOAuth, {
          maxAge: 60 * 60 * 1000,
          httpOnly: false,
        });
    
        return res.status(200).json({success: 'Succesfully Logged In', user});
      } catch(err) {
        console.log("error ", err);
        err = err.toString().replace('Error:', '').trim();
        return res.status(400).json({message: `${err}`});
      }
    },

    async oAuthLogin(req, res) {
      var mapper = new UserDtoMapper();
      const persistantUser = mapper.toPersistant(req.user, req.body);
      const getUserCase = new GetUser(new MongoUserRepository());
      const oAuthlogin = new OAuthLoginUser(new MongoUserRepository());
      const oAuthTokenObject = req.body.oauth;
      var payload;
      
      try{

        payload = await verify(oAuthTokenObject.token);
        await verify(oAuthTokenObject.token).catch(console.error);
      } catch(err){
        console.log("Erro on verifying google oauth: ", err);
        return res.status(400).json({message: 'Unauthorized user inner.'});

      }

      try {
        var userFound = await getUserCase.getUserByName(persistantUser);
        if(userFound == null) {
          const oAuthSignup = new OAuthSignup(new MongoUserRepository());
          const createInitialNote = new CreateInitialNote(new MongoNoteRepository());
          userFound = await mapper.authWrapper(persistantUser, oAuthTokenObject);
          const savedUser = await oAuthSignup.signupUser(userFound);
          await createInitialNote.createInitialNote(savedUser._id);
        } else {
          userFound = mapper.authWrapper(persistantUser, oAuthTokenObject);
        }
        
        const comingOAuthType = Constants[oAuthTokenObject.name];
        if(comingOAuthType !== userFound.isOAuth) {
          return res.status(400).json({message: 'User is not authorized.'});
        }
        const user = await oAuthlogin.login(userFound);
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

      res.cookie('isOAuth', user.isOAuth, {
        maxAge: 60 * 60 * 1000,
        httpOnly: false,
      });
  
        return res.status(200).json({success: 'Succesfully Logged In', user});
      } catch(err) {
        console.log(`error ${err}`)
        return res.status(400).json({message: 'User is not authorized.'});
      }
    },

    async logout(req, res) {
        const persistantUser = new UserDtoMapper().toPersistant(req.user, req.body);
        const logoutUserCase = new LogoutUser(new MongoUserRepository());
        try {
          await logoutUserCase.logoutUser(persistantUser);
          res.cookie('token', {expires: Date.now()});
          return res.status(200).json({message: 'Logout successfully.'});
        } catch(err) {
          console.log(`Something went wrong while logging out. ${err}`);
          return res.status(400).json({message: 'Something went wrong while logging out.'});
        }
    },

    async unlockPWD(req, res) {
        const persistantUser = new UserDtoMapper().toPersistant(req.user, req.body);
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
    },

    async updateUser(req, res) {
        const persistantUser = new UserDtoMapper().toPersistant(req.user, req.body);
        const updateUserCase = new UpdateUser(new MongoUserRepository());
        try {
          var user = await updateUserCase.updateUser(persistantUser);
          return res.status(200).json({success: `Succesfully Updated Profile`, user});
        } catch(err) {
          console.log(`Something went wrong while updating the profile: ${err}`);
          return res.status(500).json({failure: `Something went wrong while updating the profile`, user});
        }
    },

}

async function verify(token) {
  // Google OAuth Check TokenID Integrity - Start
  var CLIENT_ID = process.env.SECRET_GOOGLE;
  const client = new OAuth2Client(CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  // Google OAuth Check TokenID Integrity - End
  return payload;
}


