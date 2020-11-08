const User = require('../../../Entities/UserEntity');
const UserDTO = require('../UserDTO');
const Constants = require('../../Constants');

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

    authWrapper(user, authenticationObject) {
        switch(authenticationObject.name) {
            case 'google':
                user.isOAuth = Constants.google;
                break;
            case 'facebook':
                user.isOAuth = Constants.facebook;
                break;
            case 'twitter':
                user.isOAuth = Constants.twitter;
                break;
            default:
                user.isOAuth = Constants.web;
                break;
        }
        console.log("USER TOKEN IN AUTHWRAPPER: ",authenticationObject.token);
        user.token = authenticationObject.token;
        user.oAuthId = authenticationObject.googleId;
        return user;
    }
}

// TODO: ENUM-like authentication {app = 0, google = 1, facebook = 2, twitter = 3}

module.exports = UserDtoMapper;