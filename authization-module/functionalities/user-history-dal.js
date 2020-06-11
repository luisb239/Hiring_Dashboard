'use strict'

const dalUtils = require('../common/util/dal-utils')
module.exports = {

    /**
     *
     * @param userId
     * @param date
     * @param description
     * @returns {Promise<void>}
     */
    create: async (userId, date, description) => dalUtils
        .executeQuery(
            {
                statement: 'INSERT INTO Users_History(user_id,date,description) VALUES (?,?,?);',
                description: "user history registration",
                params: [userId, date, description]
            }),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: async () => dalUtils
        .executeQuery(
            {
                statement: "SELECT * FROM Users_History",
                description: "get all user histories",
                params: []
            }),
    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    getAllFromUser: async (userId) => dalUtils
        .executeQuery(
            {
                statement: "SELECT * FROM Users_History WHERE id = ?",
                description: "get all histories from specific user",
                params: [userId]
            })

}
