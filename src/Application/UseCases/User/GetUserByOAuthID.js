class GetUserByOAuthID {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async getUserByOAuthID(oAuthID) {
        try {
            return await this._userRepository.getByOAuthId(oAuthID);
        } catch(err) {
            console.log(`Error while getting user in use case: ${err}`);
            throw new Error(`Error while getting user in use case: ${err}`);
        }
    };
}

module.exports = GetUserByOAuthID;