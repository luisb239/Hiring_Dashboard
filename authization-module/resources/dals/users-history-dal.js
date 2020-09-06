const UserHistory = require('../sequelize-model').UserHistory,
    tryCatch = require('../../common/util/functions-utils');

/**
 * @module
 */
module.exports = {

    /**
     * Register an action made by an user and the affected users by that action in the database.
     * @param {Date} date
     * @param {int} updater
     * @param {string} description
     * @param {int} user_id
     * @returns {Promise<void>}
     */
    create: (date, updater, description, user_id) => tryCatch(() => UserHistory.create({
        date,
        updater,
        description,
        user_id
    })),

    /**
     * Returns all history of all users.
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => UserHistory.findAll({raw: true})),
    /**
     * Return all the user activity
     * @param {int} userId
     * @returns {Promise<Object|Error>}
     */
    getAllFromUser: userId => tryCatch(() => UserHistory.findAll({where: {user_id: userId}})),

    /**
     * Middleware that saves the activity in the database
     * @param {Request} req
     * @param {Response} res
     * @param {function} next
     * @constructor
     */
    OLDsaveHistory: (req, res, next) => {
        if (req.user) {
            const [, , resource] = req.path.split('/');
            UserHistory.create({
                resource,
                user_id: req.user.id,
                date: new Date(),
                success: 1,
                action: req.method,
                from: req.connection.remoteAddress
            });
        }
        next();
    },

};
