module.exports = class User {
    constructor(user) {
        this.usuerid = user._id;
        this.username = user.userName;
        this.pwd = user.pwd;
        this.token = user.token;
        this.image = user.image;
        this.description = user.description;
    }
}