'use strict'

module.exports = (service) => {
    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId
    }

    async function getProcessDetail(req, res) {
        const process = await service.getProcessDetail({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId
        })
        res.status(200).send(process)
    }

    async function getProcessesByRequestId(req, res) {
        const processes = await service.getProcessesByRequestId({
            requestId: req.params.id,
            inCurrentPhase: req.query.current_phase
        })
        res.status(200).send(processes)
    }
}
