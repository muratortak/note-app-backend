class IRepository {
    async add(item) {
        return Promise.reject(new Error('not implemented.'));
    }

    async getAll() {
        return Promise.reject(new Error('not implemented.'));
    }

    async getById(itemid) {
        return Promise.reject(new Error('not implemented.'));
    }
    
    async update(item) {
        return Promise.reject(new Error('not implemented.'));
    }

    async delete(itemid) {
        return Promise.reject(new Error('not implemented.'));
    }
}

module.exports = IRepository;