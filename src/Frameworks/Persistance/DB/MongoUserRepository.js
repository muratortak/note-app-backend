const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const UserRepository = require('../../../Application/Interfaces/UserRepository');
const url = 'mongodb://localhost:27017';
const connectionOptions = {poolSize: process.env.MONGO_POOLSIZE || 1};
const dbName = 'dashboard';

module.exports = class MongoUserRepository extends UserRepository {
    constructor() {
        super();
        // let db;
        // client.connect(url, connectionOptions, (err, database) => {
        //     if (err) {
        //         console.error("Error connecting to DB in repo ", err);
        //         throw new Error(err);
        //     }
        //     console.log('DB is connected in Mongo User Repository.');
        //     db = database.db(dbName);
        //     console.log("DB IN CONSTRUCTOR: ");
        //     this.db = db;
        //     this.collectionName = 'Users';
        // });
        this.db = null;
        this.collectionName = 'Users';
    }

    async connect() {
        var connection = await client.connect(url, connectionOptions, (err, database) => {
            if (err) {
                console.error("Error connecting to DB in repo ", err);
                throw new Error(err);
            }
            // console.log('db: ', db)
            db = database.db(dbName);
        });
        console.log("COnnection: ", connection);
        this.db = db;
    }

    add(newUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    getById(userId) {
    //     const {token, tokenClient} = await getToken(user._id);
    //     user = await this.db.collection(collectionName)
    //   .findOneAndUpdate(
    //       {_id: new ObjectID(userId)},
    //       {$set: {token: tokenClient}},
    //       {returnOriginal: false},
    //   );
      return Promise.reject(new Error('not implemented.'));

    }

    async getByUserName(userName) {
        try{
            console.log("THIS.DB in GETBYUSERNAME: ", this.db);
            let user = await this.db.collection(this.collectionName).findOne({userName});
            return user;
        } catch(err) {
            console.log("ERROR FINDIN USER" , err)
            throw new Error('error finding user');
        }
    }

    update(updatedUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    delete(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async updateToken(userId, tokenClient) {
        try{
            let user = await this.db.collection(this.collectionName)
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

