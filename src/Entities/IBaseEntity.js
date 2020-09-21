class IBaseEntity {
    constructor(uid) {
        if(uid === undefined) {
            throw new Error("UID is not valid.");
        }

        this.uid = uid;
    }
}

module.exports = IBaseEntity;
