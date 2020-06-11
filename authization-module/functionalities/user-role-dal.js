'use strict'

const moment = require('moment'),
    dalUtils = require('../common/util/dal-utils'),
    errors = require('../common/errors/app-errors'),
    config = require('../common/config/config')

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
    create: async (user, role, startDate, endDate, updater, active) => dalUtils
        .executeQuery(
            {
                statement: config.sgbd == 'mysql' ?
                'INSERT INTO Users_Roles(user,role,start_date,end_date,updater,active) VALUES (?,?,?,?,?,?);' :
                'INSERT INTO Users_Roles(user,role,start_date,end_date,updater,active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;',
                description: "adding user_role",
                params: [user, role, startDate, endDate, updater, active]
            }).then(async result=>{
                return config.sgbd == 'mysql' ? result : { insertId: result.rows[0].id }
            }),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    deactivate: async (id) => dalUtils
        .executeQuery(
            {
                statement: 'UPDATE Users_Roles SET active = 0 WHERE id = ?',
                description: 'deactivate user_role´s status',
                params: [id]
            }),
    /**
     * checks if all User roles are active
     * @returns {Promise<*>}
     */
    getAllActive: async () => dalUtils
        .executeQuery(
            {
                statement: `Select * from User_Roles where active=1 AND end_date>'${moment().format()}'`,
                description: "getting active roles",
                params: []})
        .then(result=>result.length === 0 ? null : result),
    /**
     *
     * @param id
     * @returns {Promise<*>}
     */
    getUserActiveRoles: async (id) => dalUtils
        .executeQuery(
            {
                statement: `Select * from Users_Roles where user_id=? AND active=1 AND (end_date>CURRENT_TIMESTAMP || end_date IS NULL)`,
                description: "getting user's active roles",
                params: [id]})
        .then(result=>result.length === 0 ? null : result),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: async () =>dalUtils
        .executeQuery(
            {
                statement: `Select * from User_Roles`,
                description: "getting all user roles",
                params: []}),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getById: async (id) => dalUtils
        .executeQuery(
            {
                statement: 'Select * from User_Roles where user_id=?',
                description: "getting all user's roles",
                params: [id]})
}
