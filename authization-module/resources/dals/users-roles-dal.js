'use strict'

const { Role } = require('../sequelize-model')

const UserRole = require('../sequelize-model').UserRoles,
sequelize=require('../../common/util/db')

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
    create: (user, role, startDate, endDate, updater, active) => UserRole.create({
            UserId: user,
            RoleId: role,
            start_date: startDate,
            end_date: endDate,
            updater: updater,
            active: active
        }),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    deactivate: (id) => UserRole.update({active: 0}, {where: {UserId: id}}),
    /**
     * checks if all User roles are active
     * @returns {Promise<*>}
     */
    getAllActive: () => UserRole.findAll({where: {active: 1}}),
    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    getUserActiveRoles: (id) => UserRole.findAll({where: {UserId: id, active: true}}),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: () => UserRole.findAll({raw: true}),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getById: (id) => UserRole.findByPk(id)
}
