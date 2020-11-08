class OAuthSignup {
    constructor(userRepository) {
        this._userRepository  = userRepository;
    }

    async signupUser(user) {
        try {
            return await this._userRepository.add(user);
        } catch(err) {
            console.log(`Error on OAuthSignup in use case: ${err}`);
            throw new Error(`Error on OAuthSignup in use case: ${err}`);
        }
    }
}

module.exports = OAuthSignup;