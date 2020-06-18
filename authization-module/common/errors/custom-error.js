class CustomError extends Error {
    constructor(args) {
        super(args)
        this.name = this.constructor.name
    }
}

/**
 *
 * @type {CustomError}
 */
module.exports = CustomError
