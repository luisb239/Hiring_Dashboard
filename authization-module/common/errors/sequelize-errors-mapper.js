const errors = require('./app-errors');
/**
 * transforms a sequelize error into one of our errors
 * @module
 * @param sequelizeError
 * @returns sequelizeError {*}
 */
module.exports = sequelizeError => {
    const INTERNAL_SERVER_ERROR = 500;
    // we try to find a version of the error with the same name as the actual error, this is made
    // so that we can return an error containing a status code, which facilitates the api integration
    const ourVersionOfTheError = errors[Object.keys(errors).find(ourErr => ourErr === sequelizeError.name)];
    sequelizeError.status = ourVersionOfTheError ? ourVersionOfTheError.status : INTERNAL_SERVER_ERROR;
    return sequelizeError;
};
