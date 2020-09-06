// This file is the entry point for our authentication and autorization nodejs module
// it also calls the setup file

const path = require('path');

require('dotenv').config({path: path.resolve(__dirname, './.env')});

const
    config = require('./common/config/config');

const getFunctionalities = () => {

    if (config.isModuleSetUp) {

        return {

            /**
             * returns the authentication file which includes all types of authentications we support
             */
            authenticate: require('./resources/authentications'),

            /**
             * returns the check-authorization file which includes a method that verifies if the desired action
             * is allowed for the suthenticated user
             */
            authorization: require('./resources/authorizations'),

            /**
             * returns user resource file to manage users
             */
            user: require('./resources/dals/users-dal'),

            /**
             * returns idp resource file to manage idp users
             */
            idp: require('./resources/dals/idps-dal'),

            /**
             * returns list resource file to manage lists
             */
            list: require('./resources/dals/lists-dal'),

            /**
             * returns permission resource file to manage permissions
             */
            permission: require('./resources/dals/permissions-dal'),

            /**
             * returns role resource file to manage roles
             */
            role: require('./resources/dals/roles-dal'),

            /**
             * returns userRole resource file to manage user's roles
             */
            userRole: require('./resources/dals/users-roles-dal'),

            /**
             * returns rolePermission resource file to manage role's permissions
             */
            rolePermission: require('./resources/dals/roles-permissions-dal'),

            /**
             * returns userHistory resource file to check user's history
             */
            userHistory: require('./resources/dals/users-history-dal'),

            /**
             * returns configuration management file
             */
            configurations: require('./resources/configurations'),

            authTypes: require('./resources/dals/authentication-types-dal'),

            sessions: require('./resources/dals/user-session-dal'),

            userList: require('./resources/dals/user-list-dal'),

        };

    } else {
        throw new Error("Make sure you call the setup method beforehand");
    }

}


module.exports = {

    setup: async ({ app, db, rbac_opts }) => {

        if (app && db) {

            const expressSession = require('express-session');

            config.database_opts = db;

            // setup db entities, db connection and rbac policy
            await require('./common/db')(rbac_opts);

            /**
             *
             * @param defaults
             * @param session
             * @returns {{expires: *, data: *, UserId: *}}
             */
            const extendDefaultFields = (defaults, session) => ({
                data: defaults.data,
                expires: defaults.expires,
                UserId: session.passport.user,
            });

            console.log(config.env === 'production');

            app.set('trust proxy', 1);

            const
                SessionStore = require('connect-session-sequelize')(expressSession.Store),
                sequelizeSessionStore = new SessionStore({
                    db: config.sequelize,
                    table: 'Sessions',
                    extendDefaultFields
                }),
                // to keep session active instead of letting it change to the idle state
                session_opts = {
                    resave: false,
                    //saveUninitialized to false to only create a session if a UA(User agent) made a login
                    saveUninitialized: false,
                    store: sequelizeSessionStore,
                    secret: config.cookieSecret,
                    cookie: {
                        maxAge: 1000 * 60 * 60 * 24,
                        /* Uncomment to run in cloud environments
                        sameSite: config.env === 'production' ? 'none' : false,
                        secure: config.env === 'production'
                         */
                    },
                };

            // setup required middleware
            require('./common/middleware/setup-middleware')(app, expressSession(session_opts));

            config.isModuleSetUp = true;

            return getFunctionalities();

        } else {
            return new Error('Make sure you provided database connection options and express app');
        }

    },

    AuthizationRbac: require('./resources/authization-rbac').AuthizationRbac,

};
