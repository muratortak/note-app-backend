class OAuthLoginUser {
    constructor(userRepository) {
        this._userRepository = userRepository;
    }

    async login(user) {
        try{
            console.log("USER IN LOGIN USER: ", user);
            var findParamObject = {oAuthId: user.oAuthId};
            var paramValueObject = {token: user.token, image: user.image};
            var result = this._userRepository.updateWithFilter(findParamObject, paramValueObject);
            return result;
        } catch(err) {
            console.log(`Error on Google Login in use case: ${err}`);
            throw new Error(`Error on Google Login in use case: ${err}`);
        }
    }

    async validateOAuthType() {
        
    }
}

module.exports = OAuthLoginUser;