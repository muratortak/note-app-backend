const ObjectID = require('mongodb').ObjectID;
const SavedUser = require('../../DTO/UserMongo');
const IUserRepository = require('../../../Application/Interfaces/IUserRepository');

class MongoUserRepository extends IUserRepository {
    constructor() {
        super();
    }

    async add(newUser) {
        try {
            return SavedUser.create(newUser);
        } catch (err) {
            console.log(`Error while creating new user: ${err}`);
            throw new Error(`Error while creating new user: ${err}`);
        }
    }

    async getAll(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async getById(userId) {
        try {
            const user = await SavedUser.findOne({_id: ObjectID(userId)});
            return user;
        } catch(err) {
            console.log(`Error finding user with id: ${err}`)
            throw new Error(`error finding user with id: ${err}`);
        }
    }
    async getByOAuthId(oAuthId) {
        try {
            const user = await SavedUser.findOne({ oAuthId });
            return user;
        } catch(err) {
            console.log(`Error finding user with id: ${err}`)
            throw new Error(`error finding user with id: ${err}`);
        }
    }

    async getByUserName(userName) {
        try{
            let user = await SavedUser.findOne({userName: userName});
            return user;
        } catch(err) {
            console.log(`Error GetByUserName: ${err}`);
            throw new Error(`Error GetByUserName: ${err}`);
        }
    }

    async update(updatedUser) {
        try {
            var propObj = {};
            Object.assign(propObj, updatedUser);
            delete propObj._id;
            const user = await SavedUser.findOneAndUpdate(
                {_id: new ObjectID(updatedUser._id)},
                {$set: propObj},
                {new: true}
            )
            return user;
        } catch(err) {
            console.log(`Error Update: ${err}`);
            throw new Error(`Error Update: ${err}`);
        }
        
    }

    async delete(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    async updateWithFilter(findParamObject, paramValueObject) {
        if(typeof findParamObject !== 'object') throw new Error(`First Paramater is not an object type.`);
        if(typeof paramValueObject !== 'object') throw new Error(`Second Paramater is not an object type.`);
        
        try{
            let user = await SavedUser
            .findOneAndUpdate(
                findParamObject,
                {$set: paramValueObject},
                {new: true},
            );
            
            return user;
        } catch(err) {
            console.log(`Error UpdateWithFilter: ${err}`);
            throw new Error(`Error UpdateWithFilter: ${err}`);
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
            console.log(`Problem saving tokens. ${err}`);
            throw new Error(`Problem saving tokens. ${err}`)
        }
    }
}

module.exports = MongoUserRepository;