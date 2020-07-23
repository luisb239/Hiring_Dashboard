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
    create: (user, role, startDate, endDate, updater, active) => tryCatch( () =>UserRole.create({
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
    deactivate: (id) => tryCatch(() => UserRole.update({ active: 0 }, { where: { UserId: id } })),
    /**
     * checks if all User roles are active
     * @returns {Promise<*>}
     */
    getActive: () => tryCatch(UserRole.findAll({ where: { active: true } })),
    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    getUserActiveRoles: (id) => tryCatch(() => UserRole.findAll({ where: { UserId: id, active: true } })),
    /**
     *
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => UserRole.findAll({ raw: true })),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getById: (id) => tryCatch(() => UserRole.findByPk(id)),

    getUserRoles: (userId) => tryCatch(() => UserRole.findAll({ where: { UserId: userId }, include: [Role], raw: true })),

    delete: (UserId,RoleId) => tryCatch(() => UserRole.destroy({ where: { UserId: UserId,RoleId:RoleId } })),


}
