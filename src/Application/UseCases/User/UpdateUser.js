module.exports = (UserRepository) => {
    async function Execute(updatedUser) {
        Object.keys(updatedUser).forEach((key) => (updatedUser[key] == null || updatedUser[key].trim() == '') && delete updatedUser[key]);
        if(updatedUser.pwd !== undefined) {
            updatedUser.pwd = await getHashed(updatedUser.pwd);
        }
        return UserRepository.update(updatedUser);
    };

    return {
        Execute
    };
};