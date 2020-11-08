const jwt                   = require('jsonwebtoken');
const GetUserByOAuthID      = require('../../../Application/UseCases/User/GetUserByOAuthID')
const MongoUserRepository   = require('../../../Infrastructure/Persistance/DB/MongoUserRepository');
const { OAuth2Client }      = require('google-auth-library');

const auth = async (req, res, next) => {
  // TODO: ADD CHECK FOR OAUTH LOGINS LIKE GOOGLE OAUTH
  console.log("AUTH INITIAL");
  try {
    const {token} = req.cookies;
    const {isOAuth} = req.cookies;
    var decoded;
    if(isOAuth === 'undefined' || isOAuth === null || parseInt(isOAuth) === 0) {
      decoded = jwt.verify(token, process.env.SECRET_CLIENT);
    } else {
      var oAuthId = await verify(token);
      const getUserByOauth = new GetUserByOAuthID(new MongoUserRepository());
      var decoded = await getUserByOauth.getUserByOAuthID(oAuthId['sub']);
    }

    req.user = decoded._id.toString();
    next();
  } catch (err) {
    console.log("ERROR IN AUTH: ", err);
    res.status(401).send({error: 'Please make sure you logged in!'});
  }
};

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

module.exports = auth;
