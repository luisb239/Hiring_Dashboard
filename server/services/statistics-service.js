'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (statisticsDb, authModule) => {

    return {
        getStatistics,
        saveUserStatisticsConfigs,
        getUserStatisticsConfigs
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

    async function getUserStatisticsConfigs({userId}) {
        const userConfigs = await statisticsDb.getConfigs({userId})
        if (!userConfigs) {
            throw new AppError(errors.notFound,
                "Configs Not Found",
                `User ${userId} does not have any statistics configs saved`)
        }
    }

    async function saveUserStatisticsConfigs({userId, configs}) {
        // TODO -> If already exists -> update, else insert..
        await statisticsDb.saveConfigs({
            userId: userId,
            configs: configs
        })
    }
}
