const Idp = require('../sequelize-model').Idp

module.exports = {
    /**
     *
     * @param idpId
     * @param idpname
     * @param userId
     * @returns {Promise<*>}
     */
    create: async (idpId, idpname, userId) =>
         Idp.create({
                idp_id: idpId,
                idpname: idpname,
                user_id: userId
            }
        ),
    /**
     *
     * @param idpId
     * @returns {Promise<*>}
     */
    delete: async (idpId) =>
        Idp.destroy({where: {idp_id: idpId}})
}
