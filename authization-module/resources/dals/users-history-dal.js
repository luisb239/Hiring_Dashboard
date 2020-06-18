'use strict'

const UserHistory = require('../sequelize-model').UserHistory
module.exports = {

    /**
     *
     * @param userId
     * @param date
     * @param description
     * @returns {Promise<void>}
     */
    create: (userId, date, description) => UserHistory.create({
            user_id: userId,
            date: date,
            description: description
        })
    ,
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: () => UserHistory.findAll({raw: true}),

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    getAllFromUser: (userId) =>UserHistory.findByPk(userId)

}
