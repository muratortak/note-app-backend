var IBaseEntity = require('./IBaseEntity');

class User extends IBaseEntity {
    constructor(user) {
        super();

        this._id = user.id;
        this.userName = user.username;
        this.email = user.email;
        this.pwd = user.pwd;
        this.token = user.token;
        this.image = user.image;
        this.description = user.description;
    }
}

module.exports = User;