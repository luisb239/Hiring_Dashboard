'use strict'

const { Role } = require('../sequelize-model')

const UserRole = require('../sequelize-model').UserRoles,
    tryCatch = require('../../common/util/functions-utils')


module.exports = {

    /**
     * database should return duplicate error to throw
     * @param user
     * @param role
     * @param startDate
     * @param endDate
     * @param updater
     * @param active
     * @returns {Promise<void>}
     */
    create: async (user, role, startDate, endDate, updater, active) => tryCatch(() => UserRole.create({
        UserId: user,
        RoleId: role,
        start_date: startDate,
        end_date: endDate,
        updater: updater,
        active: active
    })),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    deactivate: (id) => tryCatch(() => UserRole.update({active: 0}, {where: {UserId: id}})),
    /**
     * checks if all User roles are active
     * @returns {Promise<*>}
     */
    getActive: () => tryCatch(UserRole.findAll({where: {active: 1}})),
    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    getUserActiveRoles: (id) => tryCatch(() => UserRole.findAll({where: {UserId: id, active: 1}})),
    /**
     *
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => UserRole.findAll({raw: true})),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getById: (id) => tryCatch(() => UserRole.findByPk(id)),

    getUserRoles: (userId) => tryCatch(async () => {

        const users = await UserRole.findAll({where: {UserId: userId}, include: [Role], raw: true})

        return users.map(user => {
            user.role = user['Role.role']
            delete user['Role.role']
            delete user['Role.id']
            user.parentRole = user['Role.parent_role']
            delete user['Role.parent_role']
            return user
        })
    }),

    delete: (UserId, RoleId) => tryCatch(() => UserRole.destroy({where: {UserId: UserId, RoleId: RoleId}})),

    update: async (user, role, endDate, active) => tryCatch(() => UserRole.update({
            end_date: endDate,
            active: active
        },
        {where: {UserId: user, RoleId: role}}))


}
