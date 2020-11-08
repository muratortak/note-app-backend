const MongoNoteRepository   = require('../../Infrastructure/Persistance/DB/MongoNoteRepository');
const NoteDtoMapper         = require('../../Infrastructure/DTO/Mapper/NoteDtoMapper');
const OnlyNoteMapper        = require('../../Infrastructure/DTO/Mapper/OnlyNoteMapper');
const UpdateNote            = require('../../Application/UseCases/Note/UpdateNote');
const GetAllNotes           = require('../../Application/UseCases/Note/GetAllNotes');
const DeleteNote            = require('../../Application/UseCases/Note/DeleteNote');
const AddNote               = require('../../Application/UseCases/Note/AddNote');

module.exports = {
    
    async getAllNotes(req, res) {
        const noteDtoMapper = new NoteDtoMapper();
        const persistanNote = noteDtoMapper.toPersistant(req.user, req.body);
        var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
      
        try {
          const notes = await getAllNoteCase.getAllNotes(persistanNote);
          return res.status(200).json({message: 'Notes successfull', notes});
        } catch(err) {
          console.log(`Something went wrong while fetching notes. Please try again. ${err}`);
          return res.status(500).json({message: 'Something went wrong while fetching notes. Please try again.'});
        }
    },

    async updateNote(req, res) {
        const noteDtoMapper = new NoteDtoMapper();
        const persistanNote = noteDtoMapper.toPersistant(req.user, req.body);
        var updateNoteCase = new UpdateNote(new MongoNoteRepository());
        var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
      
        try {
          await updateNoteCase.updateNote(persistanNote)
          const notes = await getAllNoteCase.getAllNotes(persistanNote);
          return res.status(200).json({message: 'Notes successfull', notes});
        } catch(err) {
          console.log(`Error while fetching notes after updating one at index level. ${err}`);
        }
    },

    async addNote(req, res) {
        const persistanNoteMognoose = new OnlyNoteMapper().toPersistant(req.body);
        try {
          const newNotes = await new AddNote(new MongoNoteRepository()).AddNote(req.user, persistanNoteMognoose);
          var notes = newNotes.note;
          return res.status(200).json({message: 'Notes successfull', notes});
        } catch(err) {
          console.log(`Error while adding new note. ${err}`);
        }
    },
    
    async deleteNote(req, res) {
        const noteID = req.params.noteID;
        if(noteID.trim().length === 0) {
          return res.status(404).json({message: `Note can't be found.`});
        }
        const noteDtoMapper = new NoteDtoMapper();
        const persistanNote = noteDtoMapper.toPersistant(req.user, {_id: noteID});
        var deleteNoteCase = new DeleteNote(new MongoNoteRepository());
        var getAllNoteCase = new GetAllNotes(new MongoNoteRepository());
        
        try {
          await deleteNoteCase.deleteNote(persistanNote);
          const notes = await getAllNoteCase.getAllNotes(persistanNote);
          return res.status(200).json({message: 'Notes successfull', notes});
        } catch(err) {
          console.log(`Error while fetching notes after updating one at index level. ${err}`);
          return res.status(500).json({message: 'Something went wrong. Please try again.'});
        }
    }
}
