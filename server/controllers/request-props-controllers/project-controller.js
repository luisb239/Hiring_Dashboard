'use strict'

const handler = require('../handler.js')

module.exports = (service) => {

    return {getProjects}

    async function getProjects(req, res) {
        try {
            const projects = await service.getProjects()
            res.status(200).send(projects)
        }
        catch (e) {
            handler(e, res, "Unable to retieve projects")
        }
    }
}
