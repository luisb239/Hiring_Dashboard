'use strict'

const handler = require('./handler.js')

module.exports = (service) => {
    return {
        getProcessDetail: getProcessDetail
    }

    async function getProcessDetail(req, res) {
        try {
            const requests = await service.getProcessDetail({
                requestId: req.params.requestId,
                candidateId: req.params.candidateId
            })
            res.status(200).send(requests)
        } catch (e) {
            handler(e, res, "Unable to retrieve process information")
        }
    }
}
