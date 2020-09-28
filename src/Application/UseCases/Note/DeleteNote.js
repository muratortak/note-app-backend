class DeleteNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async deleteNote(note) {
        if(
            note.userId === null || 
            note.userId === '' || 
            typeof note.userId === undefined ||
            note.note._id === null ||
            note.note._id.trim() === '' ||
            typeof note.note._id === undefined
        ) 
        {
            throw new Error('User or Note is not valid.');
        }
        await this._noteRepository.connect();
        return await this._noteRepository.delete(note);
    };
}
module.exports = DeleteNote;