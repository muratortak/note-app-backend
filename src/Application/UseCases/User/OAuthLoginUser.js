class OAuthLoginUser {
    constructor(userRepository) {
        this._userRepository  = userRepository;
    }

    async login(user) {
        try{
            var findParamObject = {oAuthId: user.oAuthId};
            var paramValueObject = {token: user.token};
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