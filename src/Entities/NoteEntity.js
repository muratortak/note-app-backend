var IBaseEntity = require('./IBaseEntity');

class Note extends IBaseEntity {
    constructor(note) {
        super();
        this.userId      = note.userid;
        this.note        = {};
        this.note._id    = note.note.id;
        this.note.x      = note.note.x;
        this.note.y      = note.note.y;
        this.note.title  = note.note.title;
        this.note.type   = note.note.type;
        this.note.note   = note.note.note;
        this.note.height = note.note.height;
        this.note.width  = note.note.width;
    }
}

module.exports = Note; 