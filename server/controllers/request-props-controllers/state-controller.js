'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getStates,}

    async function getStates(req, res) {
        try {
            const states = await service.getStates()
            res.status(200).send(states)
        }
        catch (e) {
            handler(e, res, "Unable to retrieve states")
        }
    }
}
