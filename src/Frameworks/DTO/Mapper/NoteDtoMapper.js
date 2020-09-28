const Note = require('../../../Entities/NoteEntity');
const NoteDTO = require('../NoteDTO');

class NoteDtoMapper {
    constructor() {

    }

    toPersistant(userid, body) {
        var note = {};
        note.id       = (typeof body._id === undefined ? '' : body._id);
        note.x        = (typeof body.initialx === undefined ? '' : body.initialx);
        note.y        = (typeof body.initialy === undefined ? '' : body.initialy);
        note.title    = (typeof body.title === undefined ? '' : body.title);
        note.type     = (typeof body.type === undefined ? '' : body.type);
        note.note     = (typeof body.note === undefined ? '' : body.note);
        note.height   = (typeof body.height === undefined ? '' : body.height);
        note.width    = (typeof body.width === undefined ? '' : body.width);

        return new Note({userid, note});
    }

    fromPersistant(persistantNote) {
        var noteDto = new NoteDTO();
        noteDto.id = persistantNote._id;
        noteDto.type = persistantNote.type;
        noteDto.title = persistantNote.title;
        noteDto.note = persistantNote.note;
        noteDto.x = persistantNote.x;
        noteDto.y = persistantNote.y;
        noteDto.height = persistantNote.height;
        noteDto.width = persistantNote.type;

        return noteDto;
    }
}

module.exports = NoteDtoMapper;