const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LogoutUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async logoutUser(user) {
        try {
            await this._userRepository.connect();
            var result = await this._userRepository.updateWithFilter(Object.create({_id: user._id}), Object.create({token: 'empty'}));
            console.log("RESULT OF LOGOUT IN USERSERVICE: ", result);
            return result;
        } catch(err) {
            console.log(`Error on logout in userService: ${err}`);
            throw new Error(`Error on logout in userService: ${err}`);
        }
    };

}

module.exports = LogoutUser;