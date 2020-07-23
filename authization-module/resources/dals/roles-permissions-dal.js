'use strict'

const RolePermission = require('../sequelize-model').RolePermission,
    rolesDal = require('./roles-dal'),
    config = require('../../common/config/config'),
    rbac = config.rbac,
    tryCatch = require('../../common/util/functions-utils')

module.exports = {

    /**
     *
     * @param role
     * @param permission
     * @returns {Promise<void>}
     */
    create: (RoleId, permission) =>
        tryCatch(async () => {
            rbac.grant(await rbac.getRole((await rolesDal.getSpecificById(RoleId)).role), await rbac.getPermission(permission.action, permission.resource))
            return RolePermission.findOrCreate({
                where: {
                    RoleId: RoleId,
                    PermissionId: permission.id
                }
            })
        }),

    /**
     *
     * @param role
     * @param permission
     * @returns {Promise<void>}
     */
    delete: (role, permission) =>
        tryCatch(() =>
            RolePermission.destroy({
                where: {
                    RoleId: role, PermissionId: permission
                }
            })),

    /**
     *
     * @param permission
     * @returns {Promise<void>}
     */
    getRolesByPermission: (permission) =>
        tryCatch(() =>
            RolePermission.findAll({
                where: {
                    PermissionId: permission
                }
            })
        )

}
