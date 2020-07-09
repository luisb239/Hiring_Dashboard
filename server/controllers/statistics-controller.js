'use strict'

const configSuffix = 'configs:'

module.exports = (service) => {

    return {
        getStatistics,
        saveConfigs,
        getConfigs
    }


    async function getStatistics(req, res) {
        const statistics = await service.getStatistics()
        res.status(200).send(statistics)
    }

    async function saveConfigs(req, res) {
        await service.saveUserStatisticsConfigs({
            userId: req.query.userId,
            configs: JSON.parse(req.body.report)
        })
        res.status(200).send({})
    }

    async function getConfigs(req, res) {

    }

}
