'use strict'

// centralized error object that derives from Node’s Error
class dbAccessError {
    constructor(type, error = null) {
        Error.call(this)
        Error.captureStackTrace(this)
        this.type = type
        this.error = error
        //...other properties assigned here
    }
}

module.exports = dbAccessError
