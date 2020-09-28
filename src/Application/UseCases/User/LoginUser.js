const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async loginUser(user) {
        await this._userRepository.connect();
        let loginUser = await this._userRepository.getByUserName(user.userName);
        var isUserValid = await this.validateUser(user.pwd, loginUser.pwd);
        if (!isUserValid) {
            throw new Error ('Login credentials are wrong!');
       }

       const {token, tokenClient} = await this.getToken(loginUser._id);

        try {
            loginUser = await this._userRepository.updateWithFilter(Object.create({_id: loginUser._id}), Object.create({token: tokenClient}));
            return loginUser;
        } catch(err) {
            console.log("error ", err);
            throw new Error('Something went wrong.');
        }
    };

    async validateUser(pwd, hash) {
        return await bcrypt.compare(pwd, hash);
    }

    // create auth token
    async getToken(id) {
        const token = jwt.sign(
            {_id: id},
            'thisisthetoken',
            {expiresIn: '7 days'},
        );

        const tokenClient = jwt.sign(
            {_id: id},
            'thisistheClienttoken',
            {expiresIn: '7 days'},
        );
    
        return {token, tokenClient};
    };

}


module.exports = LoginUser;