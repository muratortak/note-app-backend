const client = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const IUserRepository = require('../../../Application/Interfaces/IUserRepository');
const url = 'mongodb://localhost:27017';
const connectionOptions = {poolSize: process.env.MONGO_POOLSIZE || 1};
const dbName = 'dashboard';

class MongoUserRepository extends IUserRepository {
    constructor() {
        super();
        this.db = null;
        this.collectionName = 'Users';
    }

    async connect() {
        var db = await client.connect(url, connectionOptions);
        this.db = db.db(dbName);
    }

    async add(newUser) {
        try {
            const ret = await this.db.collection(this.collectionName).insertOne(newUser);
            if (ret.result.n === 1 && ret.result.ok === 1) {
                var user = ret.ops[0];
                return user.value;
            }
            return null;
        } catch(err) {
            console.log("Something went wrong while saving: ", err);
            throw new Error("Someting went wrong while saving: ", err);
        }
    }

    async getAll(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async getById(userId) {
        try{
            let user = await this.db.collection(this.collectionName).findOne({_id: ObjectID(userId)})
            return user;
        } catch(err) {
            console.log("ERROR FINDING USER WITH ID" , err)
            throw new Error('error finding user with id.');
        }
    }

    async getByUserName(userName) {
        try{
            let user = await this.db.collection(this.collectionName).findOne({userName});
            return user;
        } catch(err) {
            console.log("ERROR FINDIN USER test " , err)
            throw new Error('error finding user');
        }
    }

    async update(updatedUser) {
        var propObj = {};
        Object.assign(propObj, updatedUser);
        delete propObj._id;
        let user = await this.db.collection(this.collectionName)
                .findOneAndUpdate(
                    {_id: new ObjectID(updatedUser._id)},
                    {$set: propObj},
                    {returnOriginal: false},
                );

        return user.value;
    }

    async delete(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async updateWithFilter(findParamObject, paramValueObject) {
        console.log("PARAM IN WITH FILTER: ", findParamObject._id);
        console.log("PARAM IN WITH FILTER SECOND: ", paramValueObject.token);
        if(typeof findParamObject !== 'object') throw new Error(`First Paramater is not an object type.`);
        if(typeof paramValueObject !== 'object') throw new Error(`Second Paramater is not an object type.`);
        // Object.keys(findParamObject).forEach(key => key.name.includes('_id') > -1 ? findParamObject[key] = new ObjectID(findParamObject[key]) : findParamObject[key]);
        console.log("PARAM IN WITH FILTER: ", findParamObject._id);
        console.log("PARAM IN WITH FILTER SECOND: ", paramValueObject.token);
        try{
            let user = await this.db.collection(this.collectionName)
            .findOneAndUpdate(
                findParamObject,
                {$set: paramValueObject},
                {returnOriginal: false},
            );
            console.log("USER IN USER REPO: ", user.value);
            return user.value;
        } catch(err) {
            console.log("Problem saving tokens. ", err);
            throw new Error('Problem saving tokens. ', err)
        }
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


module.exports = MongoUserRepository;
