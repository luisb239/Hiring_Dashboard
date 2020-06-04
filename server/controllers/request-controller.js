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
            stateCsl: req.query.stateCsl,
            profile: req.query.profile,
            project: req.query.project,
            workflow: req.query.workflow,
            minQuantity: req.query.minQuantity,
            maxQuantity: req.query.maxQuantity,
            minProgress: req.query.minProgress,
            maxProgress: req.query.maxProgress
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
        const {id} = await service.createRequest({
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
        })

        // add languages tor request
        /*
            mandatoryLanguages: req.body.mandatoryLanguages,
            valuedLanguages: req.body.valuedLanguages,
         */

        res.status(201).send({
            message: 'Request created successfully',
            id: id
        })
    }


    async function getRequestsByUserAndRole(req, res) {
        const requests = await service.getRequestsByUserAndRole({
            userId: req.params.userId,
            roleId: req.params.roleId,
        })
        res.status(200).send(requests)
    }

}
