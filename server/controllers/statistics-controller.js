'use strict'

module.exports = (service) => {

    return {
        getStatistics,
    }

    async function getStatistics(req, res) {
        const statistics = await service.getStatistics()
        res.status(200).send(statistics)
    }


}
