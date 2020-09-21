const UserEntity = require( '../../Entities/UserEntity');

class IUserService {
    createUser(user) {
        return Promise.reject(new Error('not implemented.'));
    }

}

module.exports = IUserService;