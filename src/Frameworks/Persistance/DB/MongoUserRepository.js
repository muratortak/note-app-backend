const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const UserRepository = require('../../../Application/Interfaces/UserRepository');
const url = 'mongodb://localhost:27017';
const connectionOptions = {poolSize: process.env.MONGO_POOLSIZE || 1};
const dbName = 'dashboard';



module.exports = class MongoUserRepository extends UserRepository {
    constructor() {
        super();
    }

    async connect() {
        await Connection.connectToMongo();
    }
    
    async add(newUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    async getById(userId) {
        try {
            let user = await Connection.db.db('dashboard').collection('Users')
            .findOneAndUpdate(
              {_id: new ObjectID(userId)},
              {$set: {token: tokenClient}},
              {returnOriginal: false},
            );
            return user;
        } catch(err) {
            console.log(`Error on getById(). ${err}`);
            throw new Error(`Error on getById().`);
        }
        
    }

    async getByUserName(userName) {
        try {
            let user = await Connection.db.db('dashboard').collection('Users').findOne({userName});
            return user;
        } catch(err) {
            console.log("ERROR FINDIN USER test " , err)
            throw new Error('error finding user');
        }
    }

    async update(updatedUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    async delete(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async updateToken(userId, tokenClient) {
        try{
            let user = await Connection.db.db('dashboard').collection('Users')
            .findOneAndUpdate(
                {_id: new ObjectID(userId)},
                {$set: {token: tokenClient}},
                {returnOriginal: false},
            );
            return user.value;
        } catch(err) {
            console.log("Problem saving tokens. ", err);
            throw new Error('Problem saving tokens. ', err)
        }
    }
}

// TODO: Move this to startup. Add dbName, collection parameters to be used by other repositories. 
class Connection {
    static async connectToMongo() {
        if (this.db !== null) return this.db;
        
        try {
            this.db = await client.connect(this.url, this.connectionOptions);
            // console.log("AFTER CONNECTION ACTION: ", this.db);
            return this.db;
        } catch(err) {
            console.error("Error connecting to mongo db: ", err);
            throw new Error("Error connecting to Mongo DB.");
        }
    }
}

Connection.db = null;
Connection.dbName = dbName;
Connection.url = url;
Connection.connectionOptions = connectionOptions;
