module.exports = (NoteRepository) => {
    async function Execute(noteId, title, note, type) {
        if(noteId === null || noteId === 'undefined') {
            throw new Error('NoteId is not valid.');
        }
        return NoteRepository.updateNote(noteId, title, note, type);        
    };

    return {
        Execute
    };
};