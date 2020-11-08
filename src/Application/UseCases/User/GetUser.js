class GetUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async getUser(user) {
        try {
            return await this._userRepository.getById(user._id);
        } catch(err) {
            console.log(`Error while getting user in use case: ${err}`);
            throw new Error(`Error while getting user in use case: ${err}`);
        }
    };

    async getUserByName(user) {
        try {
            return await this._userRepository.getByUserName(user.userName);
        } catch(err) {
            console.log(`Error while getting user in use case: ${err}`);
            throw new Error(`Username or password is wrong.`);
        }
    }
}

module.exports = GetUser;