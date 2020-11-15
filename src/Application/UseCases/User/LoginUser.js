const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class LoginUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async loginUser(userSent, userFound) {
        try {
            var isUserValid = await this.validatePassword(userSent.pwd, userFound.pwd);
            
            if (!isUserValid) {
                throw new Error ('Login credentials are wrong!');
            }
            
            const {token, tokenClient} = await this.getToken(userFound._id, userFound.isOAuth, userFound.oAuthId);
            
            var findParamObject = {_id: userFound._id};
            var paramValueObject = {token: tokenClient};
            userFound = await this._userRepository.updateWithFilter(findParamObject, paramValueObject);
            return userFound;
        } catch(err) {
            console.log(`Error while login user in LoginUser use case: ${err}`);
            throw new Error(`Username or password is wrong.`);
        }
    };

    async loginUserGoogle() {
        
    }

    async validatePassword(pwd, hash) {
        return await bcrypt.compare(pwd, hash);
    }

    async testFun() {
        return true;
    }

    // create auth token
    async getToken(id) {
        const token = jwt.sign(
            {_id: id},
            process.env.SECRET,
            {expiresIn: '7 days'},
        );

        const tokenClient = jwt.sign(
            {_id: id},
            process.env.SECRET_CLIENT,
            {expiresIn: '7 days'},
        );
    
        return {token, tokenClient};
    };

}


module.exports = LoginUser;