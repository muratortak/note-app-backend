const ObjectID = require('mongodb').ObjectID;
const SavedNote = require('../../DTO/NoteMongo');
const SingleNoteMongo = require('../../DTO/SingleNoteMongo');
const INoteRepository = require('../../../Application/Interfaces/INoteRepository');

class MongoNoteRepository extends INoteRepository {
    constructor() {
        super();
    }

    async add(userid, newNote) {
        try {
            var addedNote = await SingleNoteMongo.create(newNote);
            return await SavedNote.findOneAndUpdate(
                {userid: new ObjectID(userid)},
                { $push: { note: addedNote._id }},
                {new: true}
            ).populate('note');
        } catch(err) {
            console.log(`Error Add Note Repository: ${err}`);
            throw new Error(`Error Add Note Repository: ${err}`);
        }
        
    }

    async createInitialNote(userid) {
        try {
            await SavedNote.create({userid});
        } catch(err) {
            console.log(`Error CreatingInitialNote Note Repository: ${err}`);
            throw new Error(`Error CreatingInitialNote Note Repository: ${err}`);
        }
    }

    async getAll(userId) {
        try {
            const notes = await SavedNote.findOne({userid: new ObjectID(userId)}).populate('note');
            return notes.note;
        } catch(err) {
            console.log(`Error GetAll Note Repository: ${err}`);
            throw new Error(`Error GetAll Note Repository: ${err}`);
        }
    }

    async getById(userId, noteId) {
        try {
            const note = await this.db.collection(this.collectionName)
                    .findOne(
                        { userId: new ObjectID(userId) },
                        { arrayFilters: [{"elem._id": new ObjectID(noteId)}] }
                    );
            return note;
        } catch(err) {
            console.log(`Error GetById Note Repository: ${err}`)
            throw new Error(`Error GetById Note Repository: ${err}`);
        }
    }

    async update(updatedNote) {
        try {
            var propObj = {};
            updatedNote = updatedNote.note;
            Object.assign(propObj, updatedNote);
            delete propObj._id;
            await SingleNoteMongo.findOneAndUpdate(
                { _id: new ObjectID(updatedNote._id) },
                { $set: propObj }
            )
        } catch(err) {
            console.log(`Error Update Note Repository: ${err}`)
            throw new Error(`Error Update Note Repository: ${err}`);
        }
    }

    async delete(note) {
        try {
            await SavedNote.updateOne(
                { userid: new ObjectID(note.userId) },
                { $pull: { note: new ObjectID(note.note._id) } }
            );

            await this.inactivateNote(note.note._id);
        } catch(err) {
            console.log(`Error Delete Note Repository: ${err}`)
            throw new Error(`Error Delete Note Repository: ${err}`);
        }
    }

    async inactivateNote(noteid) {
        try {
            await SingleNoteMongo.updateOne(
                { _id: new ObjectID(noteid) },
                { active: false }
            )
        } catch(err) {
            console.log(`Error InactivateNote Note Repository: ${err}`)
            throw new Error(`Error InactivateNote Note Repository: ${err}`);
        }
    }
}

module.exports = MongoNoteRepository;