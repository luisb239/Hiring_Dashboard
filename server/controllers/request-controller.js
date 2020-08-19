'use strict'

module.exports = (service) => {

    return {
        getRequests: getRequests,
        postRequest: postRequest,
        getRequestById: getRequestById,
        addUserToRequest: addUserToRequest,
        patchRequest: patchRequest,
        deleteLanguage: deleteLanguage,
        countRequests: countRequests,
        addLanguageToRequest: addLanguageToRequest
    }

    async function getRequests(req, res) {
        const requests = await service.getRequests({
            pageNumber: req.query.pageNumber,
            pageSize: req.query.pageSize,
            skill: req.query.skill,
            state: req.query.state,
            stateCsl: req.query.stateCsl,
            profile: req.query.profile,
            project: req.query.project,
            workflow: req.query.workflow,
            minQuantity: req.query.minQuantity,
            maxQuantity: req.query.maxQuantity,
            minProgress: req.query.minProgress,
            maxProgress: req.query.maxProgress,
            targetDate: req.query.targetDate,
            userId: req.query.currentUser ? req.user.id : null
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
            skill: req.body.skill,
            project: req.body.project,
            profile: req.body.profile,
            workflow: req.body.workflow,
            dateToSendProfile: req.body.dateToSendProfile,
        })

        /* TODO -> UNCOMMENT SOON
        await service.addRequestToUser({
            userId: req.user.id,
            requestId: id
        })
         */

        res.status(201).send({
            message: 'Request created successfully',
            id: id
        })
    }

    async function addLanguageToRequest(req, res) {
        await service.addLanguageToRequest({
            requestId: req.params.id,
            language: req.body.language,
            isMandatory: req.body.isMandatory
        })

        res.status(200).send({
            message: `${req.body.language} ` + req.body.isMandatory ? 'mandatory' : 'valued' +
                ` requirement successfully deleted from request ${req.params.id}`
        })
    }

    async function deleteLanguage(req, res) {
        await service.deleteLanguage({
            requestId: req.params.id,
            language: req.params.language,
            isMandatory: req.query.isMandatory
        })

        res.status(200).send({
            message: 'Language deleted successfully'
        })
    }


    async function addUserToRequest(req, res) {
        await service.addUserToRequest({
            requestId: req.params.id,
            userId: req.body.userId,
            roleId: req.body.roleId,
            currentUsername: req.user.username,
            timestamp: req.body.timestamp
        })

        res.status(201).send({
            message: 'User added to the request successfully'
        })
    }

    async function patchRequest(req, res) {
        await service.updateRequest({
            id: req.params.id,
            state: req.body.state,
            stateCsl: req.body.stateCsl,
            description: req.body.description,
            quantity: req.body.quantity,
            targetDate: req.body.targetDate,
            skill: req.body.skill,
            project: req.body.project,
            profile: req.body.profile,
            dateToSendProfile: req.body.dateToSendProfile,
            mandatoryLanguages: req.body.mandatoryLanguages,
            valuedLanguages: req.body.mandatoryLanguages,
            timestamp: req.body.timestamp
        })

        res.status(201).send({
            message: 'Request updated successfully'
        })
    }

    async function countRequests(req, res) {
        const count = await service.countRequests({
            skill: req.query.skill,
            state: req.query.state,
            stateCsl: req.query.stateCsl,
            profile: req.query.profile,
            project: req.query.project,
            workflow: req.query.workflow,
            minQuantity: req.query.minQuantity,
            maxQuantity: req.query.maxQuantity,
            minProgress: req.query.minProgress,
            maxProgress: req.query.maxProgress,
            targetDate: req.query.targetDate,
            userId: req.query.currentUser ? req.user.id : null
        })
        res.status(200).send(count)
    }
}
