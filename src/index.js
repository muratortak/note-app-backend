const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = require('express')();
const port = process.env.PORT || 3000;
const dotenv = require('dotenv');
const url = 'mongodb://localhost:27017/';


var userRouter = require('./Interfaces/Routes/user');
var noteRouter = require('./Interfaces/Routes/note');
var corsOptions = {
  origin: 'http://localhost:3001', 
  credentials: true
}

// TODO: Make use of Salt and Hash for Password encryption.
// TODO: Look up for a better Token Management.
// TODO: Implement Google Signup/Sign in.
// TODO: Push the code to GitHub.
// TODO: Complete Unit Tests.
// TODO: Complete Integration Tests.
// TODO: Deploy the app to Cloud. Check AWS, Google
// TODO: Search on CI/CD and deployment.

dotenv.config();

app.use(express.json({limit: '10mb'}));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/user', userRouter);
app.use('/api/note', noteRouter);

try {
  mongoose.connect(url + process.env.DB_NAME, {useNewUrlParser: true});
} catch (error) {
  console.log(`Error on mongoose connection Note Repository:, ${err}`);
  throw new Error(`Error on mongoose connection Note Repository:, ${err}`);
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});