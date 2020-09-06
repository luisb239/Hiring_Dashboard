const {Session} = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils');

/**
 * @module
 */
module.exports = {
    /**
     * Returns all existing sessions.
     * @returns {Promise<Object|Error>}
     */
    get: () => tryCatch(() => Session.findAll()),
    /**
     * Returns all session of the specified user.
     * @param {int} UserId
     * @returns {Promise<Object|Error>}
     */
    getUserSessions: UserId => tryCatch(() => Session.findAll({where: {UserId}})),

    //TODO: this doesnt receive an endDate
    /**
     * Changes the end date of the specified session
     * @param {string} sid
     * @returns {Promise<Object|Error>}
     */
    update: async (sid) => tryCatch(() => Session.update({expires: endDate,}, {where: {sid}})),
    /**
     * Deletes an existing session.
     * @param {string} sid
     * @returns {Promise<{deletedRows: (Object|Error)}>}
     */
    delete: async sid => Promise.resolve({deletedRows: await tryCatch(() => Session.destroy({where: {sid}}))}),
};
