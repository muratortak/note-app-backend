class UpdateNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async updateNote(note) {
        console.log("USE CASE UPDATENOTE: ", note)
        if(
            note.userId === null || 
            note.userId === '' || 
            typeof note.userId === undefined ||
            note.note === null ||
            typeof note.note === undefined) 
        {
            console.log('User or Note is not valid.');
            throw new Error('User or Note is not valid.');
        }
        await this._noteRepository.connect();
        await this._noteRepository.update(note);
    };
}
module.exports = UpdateNote;