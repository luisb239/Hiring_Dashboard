'use strict'

const configSuffix = 'configs:'

module.exports = (service) => {

    return {
        getStatistics,
        saveUserStatisticsConfigs,
        getUserStatisticsConfigs
    }


    async function getStatistics(req, res) {
        const statistics = await service.getStatistics()
        res.status(200).send(statistics)
    }

    async function saveUserStatisticsConfigs(req, res) {
        await service.saveUserStatisticsConfigs({
            userId: req.params.id,
            configs: JSON.parse(req.body.report)
        })
        res.status(200).send()
    }

    async function getUserStatisticsConfigs(req, res) {
        const userConfigs = await service.getUserStatisticsConfigs({
            userId: req.params.id
        })

        res.status(200).send(userConfigs.configs)
    }

}
