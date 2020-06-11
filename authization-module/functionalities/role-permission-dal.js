'use strict'

const
    dalUtils = require('../common/util/dal-utils'),
    config = require('../common/config/config')

module.exports = {
    /**
     *
     * @param role
     * @param permission
     * @returns {Promise<void>}
     */
    create: async (role, permission) => dalUtils
        .executeQuery(
            {
                statement: config.sgbd == 'mysql' ?
                    `INSERT INTO Roles_Permission(role,permission) VALUES (?,?);` :
                    `INSERT INTO Roles_Permission(role,permission) VALUES ($1,$2) RETURNING id;`,
                description: "adding role_permission",
                params: [role, permission]
            }).then(async result => {
                return config.sgbd == 'mysql' ? result : { insertId: result.rows[0].id }
            }),
    /**
     *
     * @param role
     * @param permission
     * @returns {Promise<void>}
     */
    delete: async (role, permission) => dalUtils.executeQuery(
        {
            statement: `DELETE FROM Roles_Permission Where role=? AND permission=?`,
            description: "deleting role_permission",
            params: [role, permission]
        }),
    /**
     *
     * @param permission
     * @returns {Promise<void>}
     */
    getRolesByPermission: async (permission) => dalUtils.executeQuery(
        {
            statement: `Select * from Roles_Permission where permission=?`,
            description: "get roles by permission",
            params: [permission]
        })

}
