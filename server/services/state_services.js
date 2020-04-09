'use strict'

module.exports = (db, responseHandler) => {
    return {
        getAllStates: () => {
            return db.getAllStates().then(response => responseHandler('Success', 200, response.rows))
                .catch( err => responseHandler("Internal Server Error", 500, err))
        }
    }

}