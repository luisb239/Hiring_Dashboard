'use strict'

module.exports = (service) => {

    return {getSkills}

    async function getSkills(req, res) {
        try {
            const skills = await service.getSkills()
            res.status(200).send(skills)
        }
        catch (e) {
            res.status(500).send({error : "Unexpected Error"})
        }
    }
}
