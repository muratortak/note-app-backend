module.exports = (NoteRepository) => {
    async function Execute(userId, noteId) {
        return NoteRepository.getNoteById(userId, noteId);
    };

    return {
        Execute
    };
};