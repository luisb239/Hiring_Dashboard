'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getMonths}

    async function getMonths(req, res) {
        try {
            const months = await service.getMonths()
            res.status(200).send(months)
        } catch (e) {
            handler(e, res, "Unable to retrieve months")
        }
    }
}
