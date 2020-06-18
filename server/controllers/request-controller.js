'use strict'

module.exports = (service) => {

    return {
        getRequests: getRequests,
        postRequest: postRequest,
        getRequestById: getRequestById,
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
            maxProgress: req.query.maxProgress,
            userId: req.query.userId,
            roleId: req.query.roleId
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

        res.status(201).send({
            message: 'Request created successfully',
            id: id
        })
    }
}
