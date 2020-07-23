'use strict'

const { Role, RolePermission } = require('../sequelize-model'),
    tryCatch = require('../../common/util/functions-utils'),
    Permission = require('../sequelize-model').Permission,
    config = require('../../common/config/config')

module.exports = {

    /**
  *
  * @param method
  * @param path
  * @param description
  * @returns {Promise<void>}
  */
    create: (action, resource) =>
        tryCatch(() => {
            config.rbac.createPermission(action, resource, true)
            return Permission.findOrCreate({
                where: {
                    action: action,
                    resource: resource
                }
            })
        }),

    /**
     *
     * @param method
     * @param path
     * @returns {Promise<void>}
     */
    delete: (id) =>
        tryCatch(() =>
            Permission.destroy({
                where: {
                    id: id
                }
            })),
    /**
     *
     * @returns {Promise<void>}
     */
    get: () =>
        tryCatch(() => Permission.findAll({ raw: true })),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getSpecificById: (id) => tryCatch(() => Permission.findByPk(id)),
    /**
     *
     * @param method
     * @param path
     * @returns {Promise<*>}
     */
    getSpecific: (action, resource) =>
        tryCatch(() =>
            Permission.findOne({
                where: {
                    action: action,
                    resource: resource
                }
            })),

    update: (id, action, resource) => tryCatch(() => Permission.update({ action: action, resource: resource }, { where: { id: id } })),
    getRolesByPermission: (id) => tryCatch(() => RolePermission.findAll({ where: { PermissionId: id }, include: [Role], raw: true }))

}

