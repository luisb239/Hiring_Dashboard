const
    Idp = require('../sequelize-model').Idp,
    tryCatch = require('../../common/util/functions-utils');
/**
 * @module
 */
module.exports = {
    /**
     * Returns the information of the user with id=userId
     * @param {int} userId
     * @returns {Promise<Object|Error>}
     */
    getByUserId: userId => tryCatch(() => Idp.findOne({where: {user_id: userId}})),

    /**
     * Creates a new User that was registered through an IDP, users registered through IDP's only have an id, unlike other users who also have a name and a password.
     * @param {string} idpId
     * @param {string} idpname
     * @param {int} userId
     * @returns {Promise<*>}
     */
    create: (idpId, idpname, userId) => tryCatch(() => Idp.create({idpname, idp_id: idpId, user_id: userId})),
    /**
     * Deletes the specified IDP.
     * @param {string} idpId
     * @returns {Promise<*>}
     */
    delete: idpId => tryCatch(() => Idp.destroy({where: {idp_id: idpId}})),
};
