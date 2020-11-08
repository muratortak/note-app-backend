var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserMongoose = new Schema ({
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    userName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    pwd: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    isOAuth: {
        type: Number,
        default: 0
    },
    oAuthId: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var SavedUser = mongoose.model('SavedUser', UserMongoose);
module.exports = SavedUser;


