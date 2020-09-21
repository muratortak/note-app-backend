const INoteService = require('../Interfaces/INoteService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class NoteService extends INoteService {
    constructor(noteRepository) {
        super();
        this.noteRepository = noteRepository;
    }

    async createnote(userId, newNote) {
        var note = this.noteRepository.getAll(userId);
        if(note !== null) {
            await this.noteRepository.add(userId, newNote);
            return note;
        } else {
            await this.noteRepository.insert(userId, newNote);
        }
    }

    async getAllNotes(userId) {
        try {
            const notes = await this.noteRepository.getAll(userId);
            return notes;
        } catch(err) {
            console.log(`Something went wrong in getting notes at service layer. ${err}`);
            throw new Error(`Something went wrong in getting notes at service layer. ${err}`);
        }
    }

    async getNoteById(userId, noteId) {

    }

    async updateNote(userId, updatedNote) {
        try{
            await this.noteRepository.update(userId, updatedNote);
        } catch(err) {
            console.log("error ", err);
            throw new Error('Something went wrong.');
        }
    }

    async deleteNote(userId, noteId) {
        try{
            await this.noteRepository.delete(userId, noteId);
        } catch(err) {
            console.log(`Something went wrong deleting note at service layer. ${err}`);
            throw new Error(`Something went wrong deleting note at service layer. ${err}`);
        }
    }

}

module.exports = NoteService;