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

    async add(userId, newNote) {
        try {
            newNote._id = new ObjectID();
            await this.db.collection(this.collectionName)
                    .findOneAndUpdate(
                    {userId: new ObjectID(userId)},
                    {
                        $push: { notes: newNote, }
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

    async update(userId, updatedNote) {
        try {
            await this.db.collection(this.collectionName)
                    .updateOne(
                        {
                            userId: new ObjectID(userId)
                          },
                          {
                            $set:
                            { 
                              "notes.$[elem].title": updatedNote.title,
                              "notes.$[elem].type": updatedNote.type,
                              "notes.$[elem].note": updatedNote.note,
                              "notes.$[elem].width": updatedNote.width,
                              "notes.$[elem].height": updatedNote.height,
                              "notes.$[elem].x": updatedNote.x,
                              "notes.$[elem].y": updatedNote.y,
                            }
                          },
                          {
                            arrayFilters: [{"elem._id": new ObjectID(updatedNote._id)}]
                          }
                    );

        } catch(err) {
            console.log(`Something went wrong while updating note at MongoDB Repo layer. ${err}`);
            throw new Error(`Something went wrong while updating note at MongoDB Repo layer. ${err}`)
        }
    }

    async delete(userId, noteId) {
        try {
            await this.db.collection(this.collectionName).updateOne(
                {
                  userId: new ObjectID(userId)
                },
                {
                  $pull: { notes: { _id: new ObjectID(noteId)} }
                });
        } catch(err) {
            console.log(`Something went wrong while deleting note at MongoDB Repo layer. ${err}`);
            throw new Error(`Something went wrong while deleting note at MongoDB Repo layer. ${err}`)
        }
    }

}

module.exports = MongoNoteRepository;