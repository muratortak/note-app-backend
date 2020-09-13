module.exports = (NoteRepository) => {
    async function Execute(userId) {
        return NoteRepository.getAllNotesByUserId(userId)
    };

    return {
        Execute
    };
};