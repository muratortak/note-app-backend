const User = require('../../../Entities/UserEntity');
const UserDTO = require('../UserDTO');

class UserDtoMapper {
    constructor() {

    }

    toPersistant(userId, body) {
        var user = {};
        user.id             = (typeof userId === undefined ? '' : userId);
        user.username       = (typeof body.userName === undefined ? '' : body.userName);
        user.email          = (typeof body.email === undefined ? '' : body.email);
        user.pwd            = (typeof body.pwd === undefined ? '' : body.pwd);
        user.image          = (typeof body.image === undefined ? '' : body.image);
        return new User(user);
    }

    fromPersistant(persistantUser) {
        var userDto = new UserDTO();
        userDto.id = persistantUser._id;
        userDto.type = persistantUser.type;
        userDto.title = persistantUser.title;
        userDto.note = persistantUser.note;
        userDto.x = persistantUser.x;
        userDto.y = persistantUser.y;
        userDto.height = persistantUser.height;
        userDto.width = persistantUser.type;

        return userDto;
    }
}

module.exports = UserDtoMapper;