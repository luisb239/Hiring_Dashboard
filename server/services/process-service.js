'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

module.exports = (requestDb, candidateDb, processDb, phaseDb, infoDb, processUnavailableReasonDb,
                  processPhaseDb, processInfoDb, reasonsDb, statusDb, emailService, transaction) => {

    return {
        getProcessDetail,
        getProcessesByRequestId,
        updateProcess,
        updateProcessCurrentPhase,
        createProcess,
        getUnavailableReasons,
        getAllStatus,
        updateProcessPhaseNotes
    }

    async function getAllStatus() {
        return {
            status: await statusDb.getAllStatus()
        }
    }

    async function getUnavailableReasons() {
        return {
            unavailableReasons: await reasonsDb.getAllUnavailableReasons()
        }
    }

    async function createProcess({requestId, candidateId}) {
        return transaction(async (client) => {
            await processDb.createProcess({requestId, candidateId, status: "Onhold", client})

            const {workflow} = await requestDb.getRequestById({id: requestId, client})

            const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow, client})

            const firstPhase = workflowPhases.find(phase => phase.phaseNumber === 1)

            await processPhaseDb.addPhaseToProcess({
                requestId, candidateId, phase: firstPhase.phase, client, startDate: new Date()
            })

            await processPhaseDb.setProcessInitialPhase({
                requestId, candidateId, initialPhase: firstPhase.phase, client
            })
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

    async function updateProcess({
                                     requestId, candidateId, newPhase, status,
                                     unavailableReason, infoArray, timestamp
                                 }) {
        await transaction(async (client) => {
            const rowCount = await processDb.updateProcess({requestId, candidateId, timestamp, status, client})
            if (rowCount === 0)
                throw new AppError(errors.conflict,
                    "Process not updated",
                    `Process of candidate ${candidateId} in request ${requestId} has already been updated`)

            if (newPhase) {
                await updateProcessCurrentPhase({requestId, candidateId, newPhase, client})
            }

            if (unavailableReason) {
                await updateUnavailableReason({requestId, candidateId, unavailableReason, client})
            }

            if (infoArray) {
                await updateProcessInfoValues({requestId, candidateId, infoArray, client})
            }
        })
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
        const currentPhase = await processPhaseDb.getProcessCurrentPhase({requestId, candidateId})

        const status = await processDb.getProcessStatus({requestId, candidateId})

        const reason = await processUnavailableReasonDb.getProcessUnavailableReason({requestId, candidateId})

        const processInfos = await processInfoDb.getProcessInfos({requestId, candidateId})

        const processPhases = await processPhaseDb.getProcessPhases({requestId, candidateId})

        // Get process related workflow and the workflow's phases
        const {workflow} = await requestDb.getRequestById({id: requestId})

        let workflowPhases = await phaseDb.getPhasesByWorkflow({workflow})

        workflowPhases = workflowPhases.filter(workflowPhase =>
            processPhases.find(procPhase => procPhase.phase === workflowPhase.phase))

        const processDetailedPhases = await Promise.all(workflowPhases.map(async (workflowPhase) => {
            const phaseInfos = await infoDb.getInfosByPhase({phase: workflowPhase.phase})
            const procPhase = processPhases.find(proc => proc.phase === workflowPhase.phase);
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
            status: status ? status.status : null,
            unavailableReason: reason ? reason.unavailableReason : null,
            currentPhase: currentPhase ? currentPhase.currentPhase : null,
            phases: processDetailedPhases
        }
    }

    async function updateUnavailableReason({requestId, candidateId, unavailableReason, client}) {
        const currentReason = await processUnavailableReasonDb.getProcessUnavailableReason({
            requestId,
            candidateId,
            client
        })
        if (!currentReason) {
            await processUnavailableReasonDb.setProcessInitialUnavailableReason({
                requestId,
                candidateId,
                reason: unavailableReason,
                client
            })
        } else {
            if (currentReason.unavailableReason !== unavailableReason) {
                await processUnavailableReasonDb.updateProcessUnavailableReason({
                    requestId,
                    candidateId,
                    reason: unavailableReason,
                    client
                })
            }
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
     * @param client
     * @param timestamp
     * @returns {Promise<{JSON}>}
     */
    async function updateProcessCurrentPhase({requestId, candidateId, newPhase, client}) {
        // Get process related workflow and the workflow's phases
        const {workflow} = await requestDb.getRequestById({id: requestId, client})
        const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow, client})

        // Check if newPhase is valid in the current workflow
        const validPhase = workflowPhases.find(phase => phase.phase === newPhase)
        if (!validPhase) {
            throw new AppError(errors.invalidInput,
                "Invalid Phase",
                `Phase ${newPhase} is not valid in the request workflow(${workflow})`)
        }

        // Get process current phase
        const currentPhase = await processPhaseDb.getProcessCurrentPhase({requestId, candidateId, client})

        // Check process current phase
        if (currentPhase.currentPhase === newPhase) {
            return {message: `Process current phase is already ${newPhase}`}
        }

        const processExistingPhases = await processPhaseDb.getProcessPhases({requestId, candidateId, client})

        // If phase to transition (newPhase) does not exist in the process list of phases, then
        // we must insert the newPhase in the list of process phases.
        if (!processExistingPhases.find(procPhase => procPhase.phase === newPhase)) {
            await processPhaseDb.addPhaseToProcess({
                requestId,
                candidateId,
                client,
                phase: newPhase,
                startDate: new Date()
            })
        }
        await processPhaseDb.updateProcessCurrentPhase({
            requestId,
            candidateId,
            phase: newPhase,
            client
        })

        const candidate = await candidateDb.getCandidateById({id: candidateId, client})
        const request = await requestDb.getRequestById({id: requestId, client})
        await emailService.notifyMoved({
            id: requestId,
            oldPhase: currentPhase.currentPhase,
            newPhase,
            candidate,
            request
        })
    }

    /**
     *
     * @param requestId : number
     * Request id
     * @param candidateId : number
     * Candidate id
     * @param infoArray : Array
     * Info Array. Each element of the array has a name and a value property
     * @param client
     * @param timestamp
     * @returns {Promise<void>}
     */
    async function updateProcessInfoValues({requestId, candidateId, infoArray, client, timestamp}) {
        const processInfos = await processInfoDb.getProcessInfos({requestId, candidateId, client})

        await Promise.all(infoArray.map(async info => {
            const infoFound = processInfos.find(procInfo => procInfo.name === info.name)
            if (!infoFound) {
                await processInfoDb.createProcessInfo({
                    requestId,
                    candidateId,
                    infoName: info.name,
                    infoValue: `{"value" : "${info.value}"}`,
                    client
                })
            } else {
                if (infoFound.value.value !== info.value) {
                    await processInfoDb.updateProcessInfoValue({
                        requestId,
                        candidateId,
                        infoName: info.name,
                        infoValue: `{"value" : "${info.value}"}`,
                        client
                    })
                }
            }
        }))
    }

    async function updateProcessPhaseNotes({requestId, candidateId, phase, notes, timestamp}) {
        await transaction(async (client) => {
            await processPhaseDb.updatePhaseOfProcess({
                requestId, candidateId, phase, notes, client
            })

            if (!await processDb.updateProcess({
                requestId: requestId,
                candidateId: candidateId,
                timestamp: timestamp, client: client
            })) {
                throw new AppError(errors.conflict,
                    'Could not Update Process Notes',
                    'The process notes have already been updated')
            }
        })
    }

}
