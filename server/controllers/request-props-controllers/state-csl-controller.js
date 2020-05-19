'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getStatesCsl,}

    async function getStatesCsl(req, res) {
        try {
            const statesCsl = await service.getStatesCsl()
            res.status(200).send(statesCsl)
        }
        catch (e) {
            handler(e, res, "Unable to retrieve states csl")
        }
    }
}
