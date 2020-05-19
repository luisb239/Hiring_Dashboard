'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getProfiles}

    async function getProfiles(req, res) {
        try {
            const profiles = await service.getProfiles()
            res.status(200).send(profiles)
        }
        catch (e) {
            handler(e, res, "Unable to retrieve profiles")
        }
    }
}
