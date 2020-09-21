var IBaseEntity = require('./IBaseEntity');

class Note extends IBaseEntity {
    constructor(useruid, note) {
        this.useruid = useruid;
        this.note = note;
    }
}

module.exports = Note; 