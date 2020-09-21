var IRepository = require('./IRepository');

class IUserRepository extends IRepository {
    async getByUserName(userName) {
        return Promise.reject(new Error('not implemented.'));
    }
    
    async updateToken(userId, token, clientToken) {
        return Promise.reject(new Error('not implemented.'));
    }
}

module.exports = IUserRepository;