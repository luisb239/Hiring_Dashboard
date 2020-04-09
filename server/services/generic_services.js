'use strict'

module.exports = (db, responseHandler) => {
    return {
        getAll: (entity) => {
            return db.getAll(entity).then(response => responseHandler('Success', 200, response.rows))
                .catch( err => responseHandler("Internal Server Error", 500, err))
        },
        post: (entity, key) => {
            return db.post(entity, key).then(response => responseHandler('Success', 201, response.rows))
                .catch( err => responseHandler("Internal Server Error", 500, err))
        }
    }

}