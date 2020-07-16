'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (statisticsDb, authModule) => {

    return {
        getStatistics,
        saveUserStatisticsConfigs,
        getUserStatisticsConfigs,
        getUserStatisticsConfigsDetails
    }

    async function getStatistics() {
        const statistics = await statisticsDb.getStatistics()

        const users = await authModule.user.getAll()
        const roles = await authModule.role.getAll()

        return statistics.map(processStats => {
            return {
                ...processStats,
                user: users.find(user => user.id === processStats.userId).username,
                role: roles.find(role => role.id === processStats.roleId).role
            }
        })
    }

    async function getUserStatisticsConfigs({ userId }) {
        const configs = await statisticsDb.getConfigs({ userId })
        return {
            configs: configs
        }
    }

    async function getUserStatisticsConfigsDetails({ userId, profileName }) {
        return await statisticsDb.getConfigsDetails({ userId, profileName })
    }

    async function saveUserStatisticsConfigs({ userId, name, configs }) {
        return await statisticsDb.saveConfigs({ userId: userId, profileName: name, configs })
    }
}
