const bcrypt = require('bcrypt');

class UnlockPWD {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async unlockPWD(user) {
        await this._userRepository.connect();
        var userFound = await this._userRepository.getById(user._id);
        var isUnlocked = await this.validateUser(user.pwd, userFound.pwd);
        return isUnlocked;
    };

    async validateUser(pwd, hash) {
        return await bcrypt.compare(pwd, hash);
    }

}

module.exports = UnlockPWD;