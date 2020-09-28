const bcrypt = require('bcrypt');

class UpdateUser {

    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async updateUser(user) {
        if(
            user._id === null || 
            user._id.trim() === ''
        ) 
        {
            console.log('User or Note is not valid.');
            throw new Error('User or Note is not valid.');
        }
        Object.keys(user).forEach((key) => (user[key] == null || user[key].trim() == '') && delete user[key]);
        if(user.pwd !== undefined) {
            user.pwd = await this.getHashed(user.pwd);
        }
        await this._userRepository.connect();
        return await this._userRepository.update(user);
    };

    async getHashed(pwd) {
        console.log("GET HASHED PWD: ", pwd);
        const hashedPwd = await bcrypt.hash(pwd, 8);
        console.log("HASED PWD: ", hashedPwd);
        return hashedPwd;
    };
}
module.exports = UpdateUser;