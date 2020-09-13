module.exports = (UserRepository) => {
    async function Execute(userId, sentPwd) {
        
        return UserRepository.getById(userId).pwd;
    };
    
    return {
        Execute
    };
};