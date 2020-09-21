getUser = (UserRepository) => {
    async function Execute(userId) {
        return UserRepository.getById(userId);
    };

    return {
        Execute
    };
};

export default getUser;