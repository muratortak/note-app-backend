module.exports = class UserRepository {
    constructor() {};

    add(newUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    getById(userId) {
        return Promise.reject(new Error('not implemented.'));
    }
    
    getByUserName(userName) {
        return Promise.reject(new Error('not implemented.'));
    }
    
    update(updatedUser) {
        return Promise.reject(new Error('not implemented.'));
    }

    delete(userId) {
        return Promise.reject(new Error('not implemented.'));
    }

    updateToken(userId, token, clientToken) {
        return Promise.reject(new Error('not implemented.'));
    }
}