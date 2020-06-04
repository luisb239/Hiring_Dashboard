'use strict'

module.exports = (service) => {
    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId,
        updateProcess: updateProcess
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
            requestId: req.params.id
        })
        res.status(200).send(processes)
    }

    async function updateProcess(req, res) {
        const process = await service.updateProcess({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId,
            newPhase: req.body.newPhase
        })
        res.status(200).send(process)
    }
}
