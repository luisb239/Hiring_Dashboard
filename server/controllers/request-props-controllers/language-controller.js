'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getLanguages}

    async function getLanguages(req, res) {
        try {
            const languages = await service.getLanguages()
            res.status(200).send(languages)
        }
        catch (e) {
            handler(e, res, "Unable to retrieve languages")
        }
    }
}
