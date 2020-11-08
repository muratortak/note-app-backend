var IBaseEntity = require('./IBaseEntity');

class NoteMongoEntity extends IBaseEntity {
    constructor(note) {
        super();
        this.x      = note.x;
        this.y      = note.y;
        this.title  = note.title;
        this.type   = note.type;
        this.note   = note.note;
        this.height = note.height;
        this.width  = note.width;
    }
}

module.exports = NoteMongoEntity;