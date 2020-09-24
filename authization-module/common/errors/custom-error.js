/**
 * Class that builds errors following the API error style, errors with status codes
 * @class
 */
class CustomError extends Error {
    constructor(title, detail, status) {
        super({title, detail, status});
        this.title = title;
        this.message = detail;
        this.status = status;
    }
}
/**
 * @module
 */
module.exports = CustomError;
