var IBaseEntity = require('./IBaseEntity');

class User extends IBaseEntity {
    constructor(user) {
        super(user.uid);

        this.useruid = user.uid;
        this.username = user.userName;
        this.pwd = user.pwd;
        this.token = user.token;
        this.image = user.image;
        this.description = user.description;
    }
}

module.exports = User;