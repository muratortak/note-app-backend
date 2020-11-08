var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NoteMongoose = new Schema ({
    userid: {
        type: mongoose.Types.ObjectId,
        ref: 'SavedUser'
    },
    note: [{type: Schema.Types.ObjectId, ref: 'SavedSingleNote'}]
});

var SavedNote = mongoose.model('SavedNote', NoteMongoose);
module.exports = SavedNote;
