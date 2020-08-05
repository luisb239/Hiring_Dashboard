'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (statisticsDb) => {

    return {
        getStatistics,
        saveUserStatisticsConfigs,
        getUserStatisticsConfigs,
        getUserStatisticsConfigsDetails
    }

    async function getStatistics() {
        return await statisticsDb.getStatistics()
    }

    async function getUserStatisticsConfigs({ userId }) {
        return await statisticsDb.getConfigs({userId})
    }

    async function getUserStatisticsConfigsDetails({ userId, profileName }) {
        return await statisticsDb.getConfigsDetails({ userId, profileName })
    }

    async function saveUserStatisticsConfigs({ userId, name, configs }) {
        return await statisticsDb.saveConfigs({ userId: userId, profileName: name, configs })
    }
}
