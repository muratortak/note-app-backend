const IUserService = require('../Interfaces/IUserService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService extends IUserService {
    constructor(userRepository) {
        super();
        this.userRepository = userRepository;
    }

    async createUser(newUser) {
        var user = this.userRepository.add(newUser);
        if(user !== null) {
            var logedInUser = await this.login(user);
            return logedInUser;
        } else {
            return null;
        }
    }

    async updateUser(userId, updatedUser) {
        try{
            Object.keys(updatedUser).forEach((key) => (updatedUser[key] == null || updatedUser[key].trim() == '') && delete updatedUser[key]);
            if(updatedUser.pwd !== undefined) {
                updatedUser.pwd = await this.getHashed(updatedUser.pwd);
            }
            var user = await this.userRepository.update(userId, updatedUser);
            return user;
        } catch(err) {
            console.log("error ", err);
            throw new Error('Something went wrong.');
        }
    }

    async login(loginUser) {
        var user = await this.userRepository.getByUserName(loginUser.username);
        var isUserValid = await this.validateUser(loginUser.pwd, user.pwd);
        if (!isUserValid) {
             throw new Error ('Login credentials are wrong!');
        }

        const {token, tokenClient} = await this.getToken(user._id);

        try {
            user = await this.userRepository.updateWithFilter(Object.create({_id: user._id}), Object.create({token: tokenClient}));
            return user;
        } catch(err) {
            console.log("error ", err);
            throw new Error('Something went wrong.');
        }
    }

    async getMe(userId) {
        try {
            var user = await this.userRepository.getById(userId);
            return user;
        } catch(err) {
            console.log(`Something went wrong while getById at service layer. ${err}`);
            throw new Error(`Something went wrong while getById at service layer. ${err}`);
        }
    }

    async unlockPwd(user) {
        try{
            var userFound = await this.userRepository.getById(user.userID);
            var isUnlocked = await this.validateUser(user.sentPWD, userFound.pwd);
            return isUnlocked;
        } catch(err) {
            console.log(`Something went wrong while unlocking pwd.`);
            throw new Error(`Something went wrong while unlocking pwd: ${err}`)
        }
    }

    async logout(userId) {
        try {
            // await this.userRepository.updateToken(userId, null);
            var result = await this.userRepository.updateWithFilter(Object.create({_id: userId}), Object.create({token: 'empty'}));
            console.log("RESULT OF LOGOUT IN USERSERVICE: ", result);
            return result;
        } catch(err) {
            console.log(`Error on logout in userService: ${err}`);
            throw new Error(`Error on logout in userService: ${err}`);
        }
    }

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

    async getHashed(pwd) {
        console.log("GET HASHED PWD: ", pwd);
        const hashedPwd = await bcrypt.hash(pwd, 8);
        console.log("HASED PWD: ", hashedPwd);
        return hashedPwd;
    };

}

module.exports = UserService;