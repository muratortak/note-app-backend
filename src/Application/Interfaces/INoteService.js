var NoteEntity = require('../../Entities/NoteEntity');

class INoteService {
    createNote(note) {
        return Promise.reject(new Error('not implemented.'));
    }
}

module.exports = INoteService;