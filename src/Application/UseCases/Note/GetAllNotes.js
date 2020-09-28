class GetAllNote {

    constructor(noteRepository) {
        this._noteRepository = noteRepository;
    }

    async getAllNotes(user) {
        if(
            user.userId === null || 
            user.userId === '' || 
            typeof user.userid === undefined) {
            throw new Error('User is not valid.');
        }
        await this._noteRepository.connect();
        return await this._noteRepository.getAll(user.userId);
    };
}

module.exports = GetAllNote;