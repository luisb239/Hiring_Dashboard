'use strict'

module.exports = (service) => {

    return {getSkills}

    async function getSkills(req, res) {
            const skills = await service.getSkills()
            res.status(200).send(skills)
    }
}
