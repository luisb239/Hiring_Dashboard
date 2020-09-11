'use strict'

// centralized error object that derives from Node’s Error
class AppError {
    constructor(commonError, title, detail, stack = null) {
        Error.call(this)
        Error.captureStackTrace(this)
        this.commonError = commonError
        this.title = title
        this.detail = detail
        this.stack = stack
        //...other properties assigned here
    }
}

module.exports = AppError

