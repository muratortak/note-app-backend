const bcrypt = require('bcrypt');
const LoginUser = require('./LoginUser');

class SignupUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async signupUser(user) {
        await this._userRepository.connect();
        user.pwd = await this.getHashed(user.pwd);
        var addedUser = await this._userRepository.add(user);
        if(addedUser !== null) {
            var userLogin = new LoginUser();
            return await userLogin(addedUser);
        } else {
            return null;
        }
    };

    async getHashed(pwd) {
        const hashedPwd = await bcrypt.hash(pwd, 8);
        return hashedPwd;
      };
      
}


module.exports = SignupUser;