class DeleteNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async deleteNote(note) {
        try{
            return await this._noteRepository.delete(note);
        } catch(err) {
            console.log(`Error while deleting note in use case: ${err}`);
            throw new Error(`Error while deleting note in use case: ${err}`);
        }
    };
}
module.exports = DeleteNote;