var NoteMongoose = require('../NoteMongo');

class NoteMongooseDTOMpper {
    constructor() {

    }

    toPersistant(body) {
        console.log("BODY IN PERSISTANT: ", body);
        var mongooseNote = new NoteMongoose({
            _id     : body._id,
            type    : body.type,
            title   : body.title,
            note    : body.note,
            x       : body.initialx,
            y       : body.initialy,
            height  : body.height,
            width   : body.width
        });

        return mongooseNote;
    }
}

module.exports = NoteMongooseDTOMpper;