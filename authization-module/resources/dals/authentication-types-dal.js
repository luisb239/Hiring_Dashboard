const AuthenticationTypes = require('../sequelize-model').AuthenticationTypes,
    tryCatch = require('../../common/util/functions-utils');

/**
 * @module
 */
module.exports = {

    /**
     * Returns all existing authentication types.
     * @returns {Promise<Object|Error>}
     */
    get: () => tryCatch(() => AuthenticationTypes.findAll()),

    /**
     * Returns all active authentication types.
     * @returns {Promise<Object|Error>}
     */
    getActive: () => tryCatch(() => AuthenticationTypes.findAll({where: {active: true}})),
    /**
     * Changes the active bit of the specified authentication
     * @param {string} protocol
     * @param {string} idp
     * @param {int} active
     * @returns {Promise<Object|Error>}
     */
    changeActive: (protocol, idp, active) => tryCatch(() => AuthenticationTypes.update({active}, {
        where: {
            protocol,
            idp
        }
    })),
    /**
     * Returns the specified authentication type if it is currently active
     * @param {string} protocol
     * @param {string} idp
     * @returns {*}
     */
    getByName: (protocol, idp) => AuthenticationTypes.findAll({where: {protocol, idp, active: true}}),

}
