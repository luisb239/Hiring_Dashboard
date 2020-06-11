const dalUtils=require('../common/util/dal-utils')

module.exports={
    /**
     *
     * @param idpId
     * @param idpname
     * @param userId
     * @returns {Promise<*>}
     */
    create: (idpId, idpname, userId) => dalUtils
        .executeQuery(
            {
                statement: 'Insert into IDP(user_id,idp_id,idpname) values (?,?,?)',
                description: "user's username update",
                params: [userId, idpId, idpname]
            }),
    /**
     *
     * @param idpId
     * @returns {Promise<*>}
     */
    delete: (idpId) => dalUtils
        .executeQuery(
            {
                statement: 'Delete from IDP where user_id=?',
                description: "user's username update",
                params: [user_id, idpId, idpname]
            })
}
