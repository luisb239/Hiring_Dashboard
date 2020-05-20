'use strict'

const handler = require('./handler.js')

module.exports = (service) => {
    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId
    }

    async function getProcessDetail(req, res) {
        try {
            const process = await service.getProcessDetail({
                requestId: req.params.requestId,
                candidateId: req.params.candidateId
            })
            res.status(200).send(process)
        } catch (e) {
            handler(e, res, "Unable to retrieve process information")
        }
    }

    async function getProcessesByRequestId(req, res) {
        try {
            const processes = await service.getProcessesByRequestId({
                requestId: req.params.id,
                inCurrentPhase: req.query.current_phase
            })
            res.status(200).send(processes)
        } catch (e) {
            handler(e, res, "Unable to retrieve processes from request")
        }
    }
}
