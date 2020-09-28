class CreateNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async createNote(note) {
        if(note.userId === null || 
            note.userId.trim() === '' ||
            typeof note.userId === undefined) {
            throw new Error('New Note is not valid.');
        }
        await this._noteRepository.connect();
        var isThereNote = await this._noteRepository.getAll(note.userId);
        if(isThereNote !== null) {
            return await this._noteRepository.add(note);
        }
        return await this._noteRepository.insert(note);
    };
}
module.exports = CreateNote;
