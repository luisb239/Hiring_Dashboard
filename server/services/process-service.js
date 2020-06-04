'use strict'

const errors = require('../errors/common-errors.js')
const AppError = require('../errors/app-error.js')

module.exports = (requestDb, candidateDb, processDb, phaseDb) => {

    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId,
        updateProcess: updateProcess
    }

    /**
     * Returns all processes present in request
     * @param requestId : number
     * Request id
     * @returns {Promise<{processes: JSON[]}>}
     */
    async function getProcessesByRequestId({requestId}) {
        const candidates = await candidateDb.getCandidatesByRequestId({requestId});

        const processes = await Promise.all(candidates.map(async (candidate) => {
            return {
                candidate: ({
                    id: candidate.id,
                    name: candidate.name
                }),
                phase: await processDb.getProcessCurrentPhase({requestId, candidateId: candidate.id})
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
     * @returns {Promise<{unavailableReason: (*|null), phases: *, infos: [], status: (*|null)}>}
     */
    async function getProcessDetail({requestId, candidateId}) {
        if (!parseInt(requestId))
            throw new AppError(errors.invalidInput, "Invalid Request ID", "Request ID must be of integer type")

        if (!parseInt(candidateId))
            throw new AppError(errors.invalidInput, "Invalid Candidate ID", "Candidate ID must be of integer type")

        if (!await requestDb.getRequestById({id: requestId}))
            throw new AppError(errors.notFound, "Request Not Found", `Request with id ${requestId} does not exist`)

        if (!await candidateDb.getCandidateById({id: candidateId}))
            throw new AppError(errors.notFound, "Candidate Not Found", `Candidate with id ${candidateId} does not exist`)

        const status = await processDb.getProcessStatus({requestId, candidateId})

        const reason = await processDb.getProcessUnavailableReason({requestId, candidateId})

        const phases = await processDb.getPhasesOfProcess({requestId, candidateId})

        const infos = await processDb.getProcessInfos({requestId, candidateId})

        return {
            status: status ? status.status : null,
            unavailableReason: reason ? reason.unavailabilityReason : null,
            phases: phases,
            infos: infos.map(info => ({name: info.name, value: info.value.value}))
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
     * @returns {Promise<{oldPhase: string, newPhase: string, message: string}>}
     */
    async function updateProcess({requestId, candidateId, newPhase}) {
        // Get process related workflow and its phases
        const {workflow} = await requestDb.getRequestById({id: requestId})
        const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow})

        // Check if newPhase is valid in the current workflow
        const validPhase = workflowPhases.find(phase => phase.phase === newPhase)
        if (!validPhase) {
            throw new AppError(errors.invalidInput,
                "Invalid Phase",
                `Phase ${newPhase} is not valid in the request workflow`)
        }


        // Get process current phase
        const currentPhase = await processDb.getProcessCurrentPhase({requestId, candidateId})

        // Process does not have a phase yet
        if (!currentPhase) {
            // Check if validPhase is first in workflow
            if (validPhase.phaseNumber === 1) {
                await processDb.addPhaseToProcess({requestId, candidateId, phase: newPhase})
                await processDb.setProcessInitialPhase({requestId, candidateId, initialPhase: newPhase})
            } else {
                throw new AppError(errors.invalidInput,
                    "Invalid Phase Transition",
                    `Process initial phase cannot be ${newPhase}`)
            }
        } else {
            // Process has a current phase

            // Check if currentPhase is equal to validPhase
            if (currentPhase === validPhase.phase) {
                throw new AppError(errors.invalidInput,
                    "Invalid Phase Transition",
                    `Process is already in phase ${validPhase.phase}`)
            }

            // Check if process can go from current phase to new phase

            const currPhase = workflowPhases.find(p => p.phase === currentPhase)

            // Difference between phase suggested number and current phase number is 1 -> Can transition
            if (validPhase.phaseNumber - currPhase.phaseNumber === 1) {
                await processDb.addPhaseToProcess({requestId, candidateId, phase: newPhase, startDate: new Date()})
                await processDb.updateProcessCurrentPhase({requestId, candidateId, phase: newPhase})
                return {
                    oldPhase: currPhase.phase,
                    newPhase: validPhase.phase,
                    message: `Process moved from phase ${currPhase.phase} to ${validPhase.phase}`
                }
            }
            // Cannot transition from current phase to suggested phase
            else {
                throw new AppError(errors.invalidInput,
                    "Invalid Phase Transition",
                    `Cannot transition from ${currPhase.phase} to ${newPhase}`)
            }
        }
    }

}
