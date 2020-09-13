module.exports = (NoteRepository) => {
    async function Execute(noteId) {
        if(noteId === null || noteId === 'undefined') {
            throw new Error('NoteId is not valid.');
        }
        return NoteRepository.deleteNote(noteId);
    };

    return {
        Execute
    };
};