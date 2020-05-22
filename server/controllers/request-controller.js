'use strict'

module.exports = (service) => {

    return {
        getRequests: getRequests,
        postRequest: postRequest,
        getRequestById: getRequestById,
        getRequestsByUserAndRole: getRequestsByUserAndRole,
    }

    async function getRequests(req, res) {
        const requests = await service.getRequests({
            skill: req.query.skill,
            state: req.query.state,
            stateCsl: req.query.state_csl,
            profile: req.query.profile,
            project: req.query.project,
            workflow: req.query.workflow,
            minQuantity: req.query.min_quantity,
            maxQuantity: req.query.max_quantity,
            minProgress: req.query.min_progress,
            maxProgress: req.query.max_progress
        })
        res.status(200).send(requests)
    }

    async function getRequestById(req, res) {
        const request = await service.getRequestById({
            id: req.params.id
        })
        res.status(200).send(request)
    }

    async function postRequest(req, res) {
        const request = await service.createRequest({
            quantity: req.body.quantity,
            description: req.body.description,
            targetDate: req.body.targetDate,
            //state: req.body.state,
            skill: req.body.skill,
            //stateCsl: req.body.state_csl,
            project: req.body.project,
            profile: req.body.profile,
            workflow: req.body.workflow,
            dateToSendProfile: req.body.dateToSendProfile,
            mandatoryLanguages: req.body.mandatoryLanguages,
            valuedLanguages: req.body.valuedLanguages,
        })
        res.status(201).send(request)
    }


    async function getRequestsByUserAndRole(req, res) {
        const requests = await service.getRequestsByUserAndRole({
            userId: req.params.userId,
            role: req.params.role,
        })
        res.status(200).send(requests)
    }

}
