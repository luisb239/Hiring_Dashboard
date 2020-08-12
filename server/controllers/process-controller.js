'use strict'

module.exports = (processService) => {

    return {
        getProcessDetail,
        getProcessesByRequestId,
        updateProcess,
        createProcess,
        getUnavailableReasons,
        getAllStatus,
        updateProcessPhaseNotes
    }

    async function getAllStatus(req, res) {
        const status = await processService.getAllStatus()
        res.status(200).send(status)
    }

    async function getUnavailableReasons(req, res) {
        const reasons = await processService.getUnavailableReasons()
        res.status(200).send(reasons)
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
        const requestId = req.params.requestId
        const candidateId = req.params.candidateId

        await processService.updateProcess({
            requestId,
            candidateId,
            newPhase: req.body.newPhase,
            status: req.body.status,
            unavailableReason: req.body.unavailableReason,
            infoArray: req.body.infos,
            timestamp: new Date()
        })

        res.status(200).send({message: 'Process updated with success'})
    }

    async function createProcess(req, res) {
        await processService.createProcess({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId
        })

        res.status(201).send({message: "Process created with success"})
    }

    async function updateProcessPhaseNotes(req, res) {
        await processService.updateProcessPhaseNotes({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId,
            phase: req.params.phase,
            notes: req.body.notes
        })
        res.status(200).send({message: `Phase ${req.params.phase} notes of process updated with success`})
    }
}
