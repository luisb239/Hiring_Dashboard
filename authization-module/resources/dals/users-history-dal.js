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
    get: () => tryCatch(() => UserHistory.findAll({raw: true})),

    /**
     *
     * @param userId
     * @returns {Promise<void>}
     */
    getAllFromUser: (userId) => tryCatch(() => UserHistory.findByPk(userId)),

    OLDsaveHistory: (req, res, next) => {
        const resource = req.path.split("/")[2]
        const action = req.method

        const user = req.user
        const from = req.connection.remoteAddress
        if (req.user) {
            UserHistory.create({
                user_id: user.id,
                date: new Date(),
                success: 1,
                action: action,
                resource: resource,
                from: from
            })
        }
        next()
    },

    saveHistory: (req, res, next) => {
        //TODO:create the saveHistory metho
        next()
    }

}

