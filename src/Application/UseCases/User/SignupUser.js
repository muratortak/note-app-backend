const bcrypt = require('bcryptjs');

class SignupUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async signupUser(user) {
        try {
            user.pwd = await this.getHashed(user.pwd);
            return await this._userRepository.add(user);
        } catch(err) {
            console.log(`Error on Signup in use case: ${err}`);
            throw new Error(`Error on Signup in use case: ${err}`);
        }
    };

    async getHashed(pwd) {
        const hashedPwd = await bcrypt.hash(pwd, 8);
        return hashedPwd;
      };
      
}

module.exports = SignupUser;