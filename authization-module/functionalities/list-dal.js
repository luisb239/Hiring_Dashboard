'use strict'

const
    moment = require('moment'),
    errors = require('../common/errors/app-errors'),
    dalUtils = require('../common/util/dal-utils'),
    parseList = (list) => {
        return {
            user: list.user_id,
            list: list.LIST,
            start_date: list.start_date,
            end_date: list.end_date,
            updater: list.updater,
            active: list.active[0],
            id: list.id
        }
    }

/**
 *
 * @param userId
 * @returns {Promise<{end_date: *, active, id, list: *, user: *, start_date: *, updater}>}
 */
async function getUsersActive(userId) {
    return dalUtils
        .executeQuery(
            {
                statement: `Select * from Lists where user_id=? AND active=1 AND end_date>'${moment().format("YYYY-MM-DD HH:mm:ss")}'`,
                description: "getting user's active lists",
                params: [userId]
            })
        .then(result => {

            return {
                user: userId,
                list: result[0].LIST,
                start_date: result[0].start_date,
                end_date: result[0].end_date,
                updater: result[0].updater,
                active: result[0].active[0],
                id: result[0].id
            }
        })
}

module.exports = {



    /**
     * Creates a list entry with a user_id associated and a type of list
     * @param userId
     * @param list
     * @param startDate
     * @param endDate
     * @param updater
     * @param active
     * @returns {Promise<CustomError>}
     */
    create: (userId, list, startDate, endDate, updater, active) => getUsersActive(userId)
        // getUsersActiveList returned a list which means we can't add another list to this user
        .then(val => errors.userDuplicateActiveList)
        // if it lands on catch it means that getUserActiveList threw an error meaning that this user has no active list
        // if that's the case it means we can proceed adding the user to a new list
        .catch(err => dalUtils
            .executeQuery(
                {
                    statement: config.sgbd == 'mysql' ? 
                    `INSERT INTO Lists(user_id,list,start_date,end_date,updater,active) VALUES (?,?,?,?,?,?);` : 
                    `INSERT INTO Lists(user_id,list,start_date,end_date,updater,active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id;`,
                    description: "adding list",
                    params: [userId, list, startDate, endDate, updater, active]
                })
            .then(async result => {
                return config.sgbd == 'mysql' ? result : { insertId: result.rows[0].id }
            })),


    /**
     * deactivates active list, it only deactivates because we don't wanna change inactive list's status for history purposes
     * @param listId
     * @returns {*}
     */
    deactivate: (listId) => dalUtils
        .executeQuery(
            {
                statement: 'UPDATE Lists SET active = 0 WHERE id = ?',
                description: "deactivate list's status",
                params: [listId]
            }),

    /**
     * deletes the user association to a list
     * @param listId
     * @returns {*}
     */
    delete: (listId) => dalUtils
        .executeQuery(
            {
                statement: `DELETE FROM Lists WHERE id=?`,
                description: "deleting list",
                params: [listId]
            }),

    /**
     * asks the database for all list entries
     * @returns {
     * PromiseLike<Uint8Array | BigInt64Array | *[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array
     * | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array> | Promise<Uint8Array | BigInt64Array | *[]
     * | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array>}
     */
    getAll: () => dalUtils
        .executeQuery(
            {
                statement: `Select * from Lists`,
                description: "getting all lists",
                params: []
            })
        .then(result => result.map(list => parseList(list)))
    ,

    /**
     * asks the database for all list entries that are active at the moment
     * @returns {PromiseLike<function(*=): *> | Promise<function(*=): *>}
     */
    getAllActive: () => dalUtils
        .executeQuery(
            {
                statement: `Select * from Lists where active=1 AND end_date>'${moment().format("YYYY-MM-DD HH:mm:ss")}'`,
                description: "getting active lists",
                params: []
            })
        .then(result => result.map(list => parseList(list))),

    // asks the database for all list entries that are active and associated with a specific user
    getUsersActive,

    isUserBlackListed: async (userId) =>await dalUtils
        .executeQuery(
            {
                statement: `Select * from Lists where user_id=? AND active=B'1' AND LIST='BLACK'`,
                description: "checking if user is blacklisted",
                params: [userId]
            })
}
