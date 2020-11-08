class UpdateNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async updateNote(note) {
        try {
            await this._noteRepository.update(note);
        } catch(err) {
            console.log(`Error while updating note in use case: ${err}`);
            throw new Error(`Error while updating note in use case: ${err}`);
        }
    };
}

module.exports = UpdateNote;