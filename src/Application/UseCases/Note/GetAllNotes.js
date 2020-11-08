class GetAllNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async getAllNotes(user) {
        try {
            return await this._noteRepository.getAll(user.userId);
        } catch(err) {
            console.log(`Error while getting all notes in use case: ${err}`);
            throw new Error(`Error while getting all notes in use case: ${err}`);
        }
    };
}

module.exports = GetAllNote;