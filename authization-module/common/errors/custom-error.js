class CustomError extends Error {
    constructor(args) {
        super(args)
        this.title = args.title
        this.message = args.detail
        this.status = args.status
    }
}

module.exports = CustomError
