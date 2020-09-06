const CustomError = require('./custom-error');
const UNAUTORIZED_STATUS = 401;
const FORBIDDEN_STATUS = 403;
const BAD_REQUEST_STATUS = 400;

/**
 * @module
 */
module.exports = {

    SequelizeValidationError: {status: BAD_REQUEST_STATUS},
    SequelizeUniqueConstraintError: {status: 409},
    SequelizeForeignKeyConstraintError: {status: 409},
    SequelizeConnectionError: {status: BAD_REQUEST_STATUS},
    Unauthorized: new CustomError('Unauthorized', `The current user cannot access this resource`, UNAUTORIZED_STATUS),
    Forbidden: new CustomError('Forbidden', `The  user is not Authenticated`, FORBIDDEN_STATUS),
    IdpUserUnauthorized: new CustomError('Unauthorized', 'User registered with an identity provider so he cannot authenticate via a local strategy', UNAUTORIZED_STATUS),
    incorrectPassword: new CustomError('Incorrect Password', 'The user tried to authenticate with the wrong password', UNAUTORIZED_STATUS),
    userIsBlacklisted: new CustomError('User is Blacklisted', 'The user that tried to authenticate is currently blacklisted', UNAUTORIZED_STATUS),
    protocolIsNotActive: new CustomError('The authentication scheme you tried to use is currently inactive',
        'The authentication scheme you tried to use is currently inactive, ask an admin to activate it', BAD_REQUEST_STATUS),
};

