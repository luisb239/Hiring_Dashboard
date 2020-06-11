'use strict'

// This file is the entry point for our authentication and autorization nodejs module
// it also calls the setup file

const
    config = require('./common/config/config'),
    functionalities = {

        /**
         * returns the authentication file which includes all types of authentications we support
         */
        authenticate: require('./functionalities/authentications'),

        /**
         * returns the check-authorization file which includes a method that verifies if the desired action
         * is allowed for the suthenticated user
         */
        authorization: require('./functionalities/authorizations'),

        /**
         * returns user resource file to manage users
         */
        user: require('./functionalities/user-dal'),

        /**
         * returns idp resource file to manage idp users
         */
        idp: require('./functionalities/idp-dal'),

        /**
         * returns list resource file to manage lists
         */
        list: require('./functionalities/list-dal'),

        /**
         * returns permission resource file to manage permissions
         */
        permission: require('./functionalities/permission-dal'),

        /**
         * returns role resource file to manage roles
         */
        role: require('./functionalities/role-dal'),

        /**
         * returns userRole resource file to manage user's roles
         */
        userRole: require('./functionalities/user-role-dal'),

        /**
         * returns rolePermission resource file to manage role's permissions
         */
        rolePermission: require('./functionalities/role-permission-dal'),

        /**
         * returns userHistory resource file to check user's history
         */
        userHistory: require('./functionalities/user-history-dal'),

        /**
         * returns configuration management file
         */
        configurations: require('./functionalities/configurations')

    }

module.exports = function (app) {

    if (config.isModuleSetUp) {

        return functionalities

    }

    if (app) {
        require('./common/middleware/setup-middleware')(app)
        return functionalities
    }

    return {}

}
