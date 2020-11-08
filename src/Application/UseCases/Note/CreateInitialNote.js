class CreateInitialNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async createInitialNote(userid) {
        try {
            const initialNote = await this._noteRepository.createInitialNote(userid);
            return initialNote;
        } catch(err) {
            console.log(`Error while creating initial note in use case: ${err}`);
            throw new Error(`Error while creating initial note in use case: ${err}`);
        }
        
    };
}
module.exports = CreateInitialNote;
