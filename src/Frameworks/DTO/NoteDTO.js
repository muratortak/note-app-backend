const NoteDtoMapper = require("./Mapper/NoteDtoMapper");

class NoteDTO {
    constructor() {
        this.note.id     = '';
        this.note.type   = '';
        this.note.title  = '';
        this.note.note   = '';
        this.note.x      = '';
        this.note.y      = '';
        this.note.height = '';
        this.note.width  = '';
    }
}

module.exports = NoteDTO;