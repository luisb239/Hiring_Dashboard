'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getSkills}

    async function getSkills(req, res) {
        try {
            const skills = await service.getSkills()
            res.status(200).send(skills)
        }
        catch (e) {
            handler(e, res, "Unable to retrieve skills")
        }
    }
}
