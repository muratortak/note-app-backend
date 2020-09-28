const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const INoteRepository = require('../../../Application/Interfaces/INoteRepository');
const url = 'mongodb://localhost:27017';
const connectionOptions = {poolSize: process.env.MONGO_POOLSIZE || 1};
const dbName = 'dashboard';

class MongoNoteRepository extends INoteRepository {
    constructor() {
        super();
        this.db = null;
        this.collectionName = 'Notes';
    }

    async connect() {
        var db = await client.connect(url, connectionOptions);
        this.db = db.db(dbName);
    }

    async add(newNote) {
        try {
            newNote.note._id = new ObjectID();
            await this.db.collection(this.collectionName)
                    .findOneAndUpdate(
                    {userId: new ObjectID(newNote.userId)},
                    {
                        $push: { notes: newNote.note }
                    },
                    {returnOriginal: false},
                    )
        } catch(err) {
            console.log("Something went wrong while adding new note: ", err);
            throw new Error("Someting went wrong while adding new note: ", err);
        }
    }

    async insert(userId, newNote) {
        try{
            const note = await this.db.collection(this.collectionName)
                .insertOne({_id: new ObjectID(), userId: new ObjectID(userId), notes:[{_id: new ObjectID(), type: newNote.type, title: newNote.title, note: newNote.note, x: newNote.x, y: newNote.y, width: newNote.width, height: newNote.height }]});
            return note.ops[0]._id;    
        } catch(err) {
            console.log("Something went wrong while inserting new note: ", err);
            throw new Error("Someting went wrong while inserting new note: ", err);
        }

    }

    async getAll(userId) {
        const notes = await this.db.collection(this.collectionName)
            .findOne({userId: new ObjectID(userId)});
        return notes.notes;
    }

    async getById(userId, noteId) {
        try{
            
            const note = await this.db.collection(this.collectionName)
                    .findOne(
                        {
                            userId: new ObjectID(userId)
                          },
                          {
                            arrayFilters: [{"elem._id": new ObjectID(noteId)}]
                          }
                    );
            return note;
        } catch(err) {
            console.log("ERROR FINDING USER WITH ID" , err)
            throw new Error('error finding user with id.');
        }
    }

    async update(updatedNote) {
        try {
            await this.db.collection(this.collectionName)
                    .updateOne(
                        {
                            userId: new ObjectID(updatedNote.userId)
                          },
                          {
                            $set:
                            { 
                              "notes.$[elem].title": updatedNote.note.title,
                              "notes.$[elem].type": updatedNote.note.type,
                              "notes.$[elem].note": updatedNote.note.note,
                              "notes.$[elem].width": updatedNote.note.width,
                              "notes.$[elem].height": updatedNote.note.height,
                              "notes.$[elem].x": updatedNote.note.x,
                              "notes.$[elem].y": updatedNote.note.y,
                            }
                          },
                          {
                            arrayFilters: [{"elem._id": new ObjectID(updatedNote.note._id)}]
                          }
                    );

        } catch(err) {
            console.log(`Something went wrong while updating note at MongoDB Repo layer. ${err}`);
            throw new Error(`Something went wrong while updating note at MongoDB Repo layer. ${err}`)
        }
    }

    async delete(note) {
        try {
            await this.db.collection(this.collectionName).updateOne(
                {
                  userId: new ObjectID(note.userId)
                },
                {
                  $pull: { notes: { _id: new ObjectID(note.note._id)} }
                });
        } catch(err) {
            console.log(`Something went wrong while deleting note at MongoDB Repo layer. ${err}`);
            throw new Error(`Something went wrong while deleting note at MongoDB Repo layer. ${err}`)
        }
    }

}

module.exports = MongoNoteRepository;