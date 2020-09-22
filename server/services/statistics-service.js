'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

const dbErrors = require('../dals/errors/db-errors')

module.exports = (statisticsDb) => {

    return {
        getStatistics: getStatistics,
        saveUserStatisticsConfigs: saveUserStatisticsConfigs,
        getUserStatisticsConfigs: getUserStatisticsConfigs,
        getUserStatisticsConfigsDetails: getUserStatisticsConfigsDetails
    }

    async function getStatistics() {
        return await statisticsDb.getStatistics()
    }

    async function getUserStatisticsConfigs({ userId }) {
        return await statisticsDb.getConfigs({userId})
    }

    async function getUserStatisticsConfigsDetails({userId, profileName}) {
        const userStatisticsConfigsDetails = await statisticsDb.getConfigsDetails({userId, profileName})
        if (!userStatisticsConfigsDetails) {
            throw new AppError(errors.notFound, "Statistics Configs not found",
                `User ${userId}, or profile ${profileName}, or both, do not exist`)
        }
        return userStatisticsConfigsDetails
    }

    async function saveUserStatisticsConfigs({userId, name, configs}) {
        try {
            return await statisticsDb.saveConfigs({userId: userId, profileName: name, configs})
        } catch (e) {
            if (e.type === dbErrors.uniqueViolation) {
                throw new AppError(errors.conflict, "User statistics configs already exists",
                    `User ${userId} already has a config profile named ${name}`, e.stack)
            }
            if (e.type === dbErrors.foreignKeyViolation) {
                throw new AppError(errors.notFound, "User does not exist",
                    `User ${userId} does not exist in database`, e.stack)
            }
        }
    }

}
