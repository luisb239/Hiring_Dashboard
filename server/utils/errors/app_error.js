'use strict'

// centralized error object that derives from Node’s Error
class AppError {
    constructor(type, message) {
        Error.call(this)
        Error.captureStackTrace(this)
        this.type = type
        this.message = message
        //...other properties assigned here
    }
}
module.exports = AppError

