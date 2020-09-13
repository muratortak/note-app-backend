module.exports = (NoteRepository) => {
    async function Execute(title, note, type) {
        if(title === null || title.trim() === ''
            || type === null || type.trim() === ''
            || note === null || note.trim() === '') {
            throw new Error('New Note is not valid.');
        }
        return NoteRepository.addNote(title, note, type);
    };

    return {
        Execute
    };
};