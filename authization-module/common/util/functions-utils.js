'use strict'

const sequelizeErrorsMapper = require('../errors/sequelize-errors-mapper')

module.exports = async (fnToRun) => {

    try {
        return await fnToRun()
    } catch (error) {
        throw sequelizeErrorsMapper(error)
    }

}