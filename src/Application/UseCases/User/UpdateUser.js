const bcrypt = require('bcrypt');

class UpdateUser {

    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async updateUser(user) {
        Object.keys(user).forEach((key) => (user[key] == null || user[key].trim() == '') && delete user[key]);
        if(user.pwd !== undefined) {
            user.pwd = await this.getHashed(user.pwd);
        }
        
        return await this._userRepository.update(user);
    };

    async getHashed(pwd) {
        const hashedPwd = await bcrypt.hash(pwd, 8);
        return hashedPwd;
    };
}
module.exports = UpdateUser;