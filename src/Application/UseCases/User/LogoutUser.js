class LogoutUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async logoutUser(user) {
        try {
            var findParamObject = {_id: user._id};
            var paramValueObject = {token: ''};
            var result = await this._userRepository.updateWithFilter(findParamObject, paramValueObject);
            return result;
        } catch(err) {
            console.log(`Error on logout in use case: ${err}`);
            throw new Error(`Error on logout in use case: ${err}`);
        }
    };

}

module.exports = LogoutUser;