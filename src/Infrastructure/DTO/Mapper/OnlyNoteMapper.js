var NoteMongoEntity = require('../../../Entities/NoteMongoEntitiy');

class OnlyNoteMapper {
    constructor() {

    }

    toPersistant(body) {
        console.log("BODY IN PERSISTANT: ", body);
        var note = {
            x: body.initialx,
            y: body.initialy,
            title: body.title,
            type: body.type,
            note: body.note,
            height: body.height,
            width: body.width,
        }

        return new NoteMongoEntity(note);
    }
}

module.exports = OnlyNoteMapper;