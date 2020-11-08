class AddNNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async AddNote(userid, newNote) {
        return await this._noteRepository.add(userid, newNote);
    };
}
module.exports = AddNNote;
