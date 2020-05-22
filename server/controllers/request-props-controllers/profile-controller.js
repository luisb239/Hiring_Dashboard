'use strict'

module.exports = (service) => {

    return {getProfiles}

    async function getProfiles(req, res) {
            const profiles = await service.getProfiles()
            res.status(200).send(profiles)
    }
}
