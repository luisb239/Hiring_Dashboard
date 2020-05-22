'use strict'

module.exports = (service) => {

    return {getProjects}

    async function getProjects(req, res) {
            const projects = await service.getProjects()
            res.status(200).send(projects)
    }
}
