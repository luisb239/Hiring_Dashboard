'use strict'

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
        console.log(req.body)
        console.log("testing arguments")
    }

    async function getConfigs(req, res) {

    }

}
