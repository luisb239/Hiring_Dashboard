'use strict'

const Role = require('../sequelize-model').Role,
    { Permission, User } = require('../sequelize-model'),
    sequelize = require('../../common/util/db'),
    config = require('../../common/config/config')


module.exports = {

    /**
         *
         * @param role
         * @returns {Promise<void>}
         */
    create: async (role) => {
        config.rbac.createRole(role, true)
        Role.findOrCreate({
            where:{
            role: role
            }
        })
    },

    /**
     *
     * @param roleId
     * @returns {Promise<*>}
     */
    getSpecificById: async (roleId) =>
        Role.findByPk(roleId),

    getByName: async (roleName) => Role.findOne({ where: { role: roleName } }),
    /**
     *
     * @param roleId
     * @returns {Promise<void>}
     */
    delete: (roleId) =>
        Role.destroy({
            where: {
                id: roleId
            }
        }),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: () => Role.findAll({ raw: true }),

    getRolePermissions: (roleId) => Role.findAll({ where: { id: roleId }, include: [Permission], raw: true }),

    getRolesWithParents: () => sequelize.query(
        "SELECT id, role, parent_role FROM Role WHERE parent_role IS NOT NULL",
        { type: sequelize.QueryTypes.SELECT }
    ),
    getUsersWithThisRole: (roleId) => Role.findAll({ where: { id: roleId }, include: [User] }),
    addParentRole: async (role, parentRole) =>{ 
        config.rbac.grant(await config.rbac.getRole(parentRole.role),await config.rbac.getRole(role.role))
        Role.update({ parent_role: parentRole.id }, { where: { id: role.id} })
    }

}
