'use strict'

module.exports = (service) => {

    return {getWorkflows}

    async function getWorkflows(req, res) {
        try {
            const workflows = await service.getWorkflows()
            res.status(200).send(workflows)
        }
        catch (e) {
            res.status(500).send({error : "Unexpected Error"})
        }
    }
}
