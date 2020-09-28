class GetUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async getUser(user) {
        await this._userRepository.connect();
        return await this._userRepository.getById(user._id);
    };

}


module.exports = GetUser;