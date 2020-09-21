const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  console.log("AUTH INITIAL");
  try {
    const {token} = req.cookies;
    const decoded = jwt.verify(token, 'thisistheClienttoken');
    req.user = decoded._id;
    next();
  } catch (err) {
    console.log("ERROR IN AUTH: ", err);
    res.status(401).send({error: 'Please make sure you logged in!'});
  }
};

module.exports = auth;
