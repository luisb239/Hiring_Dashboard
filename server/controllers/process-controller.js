'use strict'

module.exports = (processService) => {
    return {
        getProcessDetail,
        getProcessesByRequestId,
        updateProcess,
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
        const requestId = req.params.requestId
        const candidateId = req.params.candidateId

        if (req.body.newPhase) {
            await processService.updateProcessCurrentPhase({
                requestId,
                candidateId,
                newPhase: req.body.newPhase
            })
        }
        if (req.body.status) {
            await processService.updateStatus({
                requestId,
                candidateId,
                status: req.body.status
            })
        }
        if (req.body.unavailableReason) {
            await processService.updateUnavailableReason({
                requestId,
                candidateId,
                unavailableReason: req.body.unavailableReason
            })
        }
        if (req.body.infos) {
            await processService.updateProcessInfoValues({
                requestId,
                candidateId,
                infoArray: req.body.infos
            })
        }
        res.status(200).send({message: 'Process updated with success'})
    }

    async function createProcess(req, res) {

        await processService.createProcess({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId
        })

        await processService.moveProcessToFirstPhase({
            requestId: req.params.requestId,
            candidateId: req.params.candidateId
        })

        res.status(201).send({message: "Process created with success"})
    }
}
