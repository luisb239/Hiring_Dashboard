'use strict'

const UserHistory = require('../sequelize-model').UserHistory,
    tryCatch = require('../../common/util/functions-utils')

module.exports = {

    /**
     *
     * @param userId
     * @param date
     * @param description
     * @returns {Promise<void>}
     */
    create: (userId, date, description) => tryCatch(() => UserHistory.create({
        user_id: userId,
        date: date,
        description: description
    }))
    ,
    /**
     *
     * @returns {Promise<void>}
     */
    get: () => tryCatch(() => UserHistory.findAll({ raw: true })),

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    getAllFromUser: (userId) => tryCatch(() => UserHistory.findByPk(userId))

}
