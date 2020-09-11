'use strict'

// centralized error object that derives from Node’s Error
class dbAccessError {
    constructor(type, stack) {
        Error.call(this)
        Error.captureStackTrace(this)
        this.type = type
        this.stack = stack
        //...other properties assigned here
    }
}

module.exports = dbAccessError
