'use strict'

module.exports = (service) => {

    return {getMonths}

    async function getMonths(req, res) {
            const months = await service.getMonths()
            res.status(200).send(months)
    }
}
