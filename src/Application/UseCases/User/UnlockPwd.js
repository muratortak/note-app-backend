const bcrypt = require('bcrypt');

class UnlockPWD {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async unlockPWD(user) {
        try {
            var userFound = await this._userRepository.getById(user._id);
            var isUnlocked = await this.validateUser(user.pwd, userFound.pwd);
            return isUnlocked;
        } catch(err) {
            console.log(`Error on Unlock PWD in use case: ${err}`);
            throw new Error(`Error on Unlock PWD in use case: ${err}`);
        }
    };

    async validateUser(pwd, hash) {
        return await bcrypt.compare(pwd, hash);
    }

}

module.exports = UnlockPWD;