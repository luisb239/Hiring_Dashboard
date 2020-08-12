'use strict'

module.exports = (service) => {

    return {
        getRequests: getRequests,
        postRequest: postRequest,
        getRequestById: getRequestById,
        postUser: postUser,
        patchRequest: patchRequest,
        deleteLanguage: deleteLanguage,
        countRequests: countRequests,
        teste
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
            dateToSendProfile: req.body.dateToSendProfile || null,
        })

        if (req.body.mandatoryLanguages && req.body.mandatoryLanguages.length) {
            await service.addLanguagesToRequest({
                requestId: id,
                languages: req.body.mandatoryLanguages,
                isMandatory: true
            })
        }
        if (req.body.valuedLanguages && req.body.valuedLanguages.length) {
            await service.addLanguagesToRequest({
                requestId: id,
                languages: req.body.valuedLanguages,
                isMandatory: false
            })
        }

        await service.addRequestToUser({
            userId: req.user.id,
            requestId: id
        })

        res.status(201).send({
            message: 'Request created successfully',
            id: id
        })
    }

    async function postUser(req, res) {
        await service.addUserToRequest({requestId: req.params.id,
            userId: req.body.userId,
            roleId: req.body.roleId,
            currentUsername: req.user.username})
        res.status(201).send({
            message: 'User added to the request successfully'
        })
    }

    async function patchRequest(req, res) {
        await service.updateRequest({
            id: req.params.id,
            quantity: req.body.quantity,
            targetDate: req.body.targetDate,
            skill: req.body.skill,
            project: req.body.project,
            profile: req.body.profile,
            dateToSendProfile: req.body.dateToSendProfile,
        })

        if (req.body.mandatoryLanguages && req.body.mandatoryLanguages.length) {
            await service.updateRequestLanguages({
                requestId: req.params.id,
                languages: req.body.mandatoryLanguages,
                isMandatory: true
            })
        }
        if (req.body.valuedLanguages && req.body.valuedLanguages.length) {
            await service.updateRequestLanguages({
                requestId: req.params.id,
                languages: req.body.valuedLanguages,
                isMandatory: false
            })
        }

        res.status(201).send({
            message: 'Request updated successfully',
            id: req.params.id
        })
    }

    async function deleteLanguage(req, res) {
        await service.deleteLanguage({
            requestId: req.params.id,
            language: req.query.language,
            isMandatory: req.query.isMandatory
        })

        res.status(200).send({
            message: 'Language deleted successfully'
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

    async function teste(req, res) {
        const result = await service.teste({char1: 'a', char2: 'b', int: 1, timestamp: req.headers['if-unmodified-since']})
        res.status(200).send(result)
    }
}
