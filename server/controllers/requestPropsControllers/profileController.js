'use strict'

module.exports = (service) => {

    return {getProfiles}

    async function getProfiles(req, res) {
        try {
            const profiles = await service.getProfiles()
            res.status(200).send(profiles)
        }
        catch (e) {
            res.status(500).send({error : "Unexpected Error"})
        }
    }
}
