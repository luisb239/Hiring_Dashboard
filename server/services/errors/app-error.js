'use strict'

// centralized error object that derives from Node’s Error
class AppError {
    constructor(commonError, title, detail) {
        Error.call(this)
        Error.captureStackTrace(this)
        this.commonError = commonError
        this.title = title;
        this.detail = detail
        //...other properties assigned here
    }
}
module.exports = AppError

