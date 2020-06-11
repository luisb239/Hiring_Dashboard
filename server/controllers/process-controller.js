'use strict'

module.exports = (processService) => {
    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId,
        updateProcess: updateProcess,
        createProcess
    }

    async function getProcessDetail(req, res) {
        const process = await processService.getProcessDetail({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId
        })
        res.status(200).send(process)
    }

    async function getProcessesByRequestId(req, res) {
        const processes = await processService.getProcessesByRequestId({
            requestId: req.params.id
        })
        res.status(200).send(processes)
    }

    async function updateProcess(req, res) {
        const process = await processService.updateProcess({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId,
            newPhase: req.body.newPhase,

        })
        res.status(200).send(process)
    }

    async function createProcess(req, res) {
        //TODO
        await processService.createProcess()
    }
}
