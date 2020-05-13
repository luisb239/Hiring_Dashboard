'use strict'

module.exports = (service) => {

    return {getProjects}

    async function getProjects(req, res) {
        try {
            const projects = await service.getProjects()
            res.status(200).send(projects)
        }
        catch (e) {
            res.status(500).send({error : "Unexpected Error"})
        }
    }
}
