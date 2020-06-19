'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (requestDb, candidateDb, processDb, phaseDb, infoDb, processUnavailableReasonDb,
                  processPhaseDb, processInfoDb) => {

    return {
        getProcessDetail,
        getProcessesByRequestId,
        updateProcessCurrentPhase,
        createProcess,
        updateStatus,
        updateUnavailableReason,
        moveProcessToFirstPhase
    }


    async function createProcess({requestId, candidateId}) {
        await processDb.createProcess({requestId, candidateId, status: "Onhold"})
    }

    async function moveProcessToFirstPhase({requestId, candidateId}) {
        const {workflow} = await requestDb.getRequestById({id: requestId})

        const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow})

        const firstPhase = workflowPhases.find(phase => phase.phaseNumber === 1)

        await processPhaseDb.addPhaseToProcess({
            requestId, candidateId, phase: firstPhase.phase, startDate: new Date()
        })

        await processPhaseDb.setProcessInitialPhase({
            requestId, candidateId, initialPhase: firstPhase.phase
        })
    }


    /**
     * Returns all processes present in request
     * @param requestId : number
     * Request id
     * @returns {Promise<{JSON}>}
     */
    async function getProcessesByRequestId({requestId}) {
        const candidates = await candidateDb.getCandidatesByRequestId({requestId});

        const processes = await Promise.all(candidates.map(async (candidate) => {
            const processCurrentPhase = await processPhaseDb.getProcessCurrentPhase({
                requestId,
                candidateId: candidate.id
            })
            const status = await processDb.getProcessStatus({requestId, candidateId: candidate.id})
            return {
                candidate: ({
                    id: candidate.id,
                    name: candidate.name
                }),
                status: status.status,
                phase: processCurrentPhase.currentPhase
            }
        }))
        return {
            processes: processes
        }
    }

    /**
     * Returns process detailed information
     * @param requestId : number
     * Represents Request Id
     * @param candidateId : number
     * Represents Candidate Id
     * @returns {Promise<{unavailableReason: (*|null), currentPhase: *, phases: number[], status: string}>}
     */
    async function getProcessDetail({requestId, candidateId}) {
        const currentPhase = (await processPhaseDb.getProcessCurrentPhase({requestId, candidateId})).currentPhase

        const status = await processDb.getProcessStatus({requestId, candidateId})

        const reason = await processUnavailableReasonDb.getProcessUnavailableReason({requestId, candidateId})

        const processInfos = await processInfoDb.getProcessInfos({requestId, candidateId})

        const processPhases = await processPhaseDb.getProcessPhases({requestId, candidateId})

        // TODO -> improve this?
        const processDetailedPhases = await Promise.all(processPhases.map(async (procPhase) => {
            const phaseInfos = await infoDb.getInfosByPhase({phase: procPhase.phase})
            procPhase.infos = phaseInfos.map(phaseInfo => {
                let value = processInfos.find(procInfo => procInfo.name === phaseInfo.name);
                value = value ? value.value : null
                return {
                    name: phaseInfo.name,
                    value: value ? value.value : null
                }
            })
            return procPhase
        }))

        return {
            status: status.status,
            unavailableReason: reason ? reason.unavailabilityReason : null,
            currentPhase: currentPhase,
            phases: processDetailedPhases
        }
    }


    async function updateStatus({requestId, candidateId, status}) {
        const success = await processDb.updateProcessStatus({requestId, candidateId, status})
        if (status === 'Placed') {
            // TODO -> update request progress
        }
        if (success) {
            return {
                message: `Process status updated with success to ${status}`
            }
        }
        //TODO
    }


    //TODO -> como tratar de todos os possiveis erros??
    async function updateUnavailableReason({requestId, candidateId, unavailableReason}) {
        const currentReason = await processUnavailableReasonDb.getProcessUnavailableReason({requestId, candidateId})
        if (!currentReason) {
            await processUnavailableReasonDb.setProcessInitialUnavailableReason({
                requestId,
                candidateId,
                reason: unavailableReason
            })
            return {message: `Process unavailable reasons set to ${unavailableReason}`}
        } else {
            if (currentReason.unavailabilityReason === unavailableReason) {
                return {message: `Process unavailable reason is already ${unavailableReason}`}
            }
            await processUnavailableReasonDb.updateProcessUnavailableReason({
                requestId,
                candidateId,
                reason: unavailableReason
            })
        }
    }

    /**
     * Updates process current phase
     * @param requestId : number
     * Represents the request id
     * @param candidateId : number
     * Represents the candidate id
     * @param newPhase : string
     * Represents the phase to be updated to
     * @returns {Promise<{JSON}>}
     */
    async function updateProcessCurrentPhase({requestId, candidateId, newPhase}) {
        // Get process related workflow and the workflow's phases
        const {workflow} = await requestDb.getRequestById({id: requestId})
        const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow})

        // Check if newPhase is valid in the current workflow
        const validPhase = workflowPhases.find(phase => phase.phase === newPhase)
        if (!validPhase) {
            throw new AppError(errors.invalidInput,
                "Invalid Phase",
                `Phase ${newPhase} is not valid in the request workflow(${workflow})`)
        }

        // Get process current phase
        const currentPhase = await processPhaseDb.getProcessCurrentPhase({requestId, candidateId})

        // Check process current phase
        if (currentPhase.currentPhase === newPhase) {
            return {message: `Process current phase is already ${newPhase}`}
        }

        const processExistingPhases = await processPhaseDb.getProcessPhases({requestId, candidateId})

        // If phase to transition (newPhase) does not exist in the process list of phases, then
        // we must insert the newPhase in the list of process phases.
        if (!processExistingPhases.find(procPhase => procPhase.phase === newPhase)) {
            await processPhaseDb.addPhaseToProcess({requestId, candidateId, phase: newPhase, startDate: new Date()})
        }
        await processPhaseDb.updateProcessCurrentPhase({requestId, candidateId, phase: newPhase})

        return {
            oldPhase: currentPhase.currentPhase,
            newPhase: validPhase.phase,
            message: `Process moved from ${currentPhase.currentPhase} to ${validPhase.phase}`
        }
    }

}
