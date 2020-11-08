var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SingleNoteMongoose = new Schema ({
    type: {
        type:String,
        default: ''
    },
    title: {
        type:String,
        default: ''
    },
    note: {
        type:String,
        default: ''
    },
    x: {
        type:String,
        default: ''
    },
    y: {
        type:String,
        default: ''
    },
    height: {
        type:String,
        default: ''
    },
    width: {
        type:String,
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
});

var SavedSingleNote = mongoose.model('SavedSingleNote', SingleNoteMongoose);
module.exports = SavedSingleNote;
