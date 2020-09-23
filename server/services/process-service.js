'use strict'

const errors = require('./errors/common-errors.js')
const AppError = require('./errors/app-error.js')

const DbError = require('../dals/errors/db-access-error')
const dbCommonErrors = require('../dals/errors/db-errors.js')

module.exports = (requestDb, candidateDb, processDb, phaseDb, infoDb, processUnavailableReasonDb,
                  processPhaseDb, processInfoDb, reasonsDb, statusDb, emailService, transaction) => {

    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId,
        updateProcess: updateProcess,
        createProcess: createProcess,
        getUnavailableReasons: getUnavailableReasons,
        getAllStatus: getAllStatus,
        updateProcessPhaseNotes: updateProcessPhaseNotes
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
        return await transaction(async (client) => {
            try {
                await processDb.createProcess({requestId, candidateId, status: "Onhold", client})
            } catch (e) {
                if (e instanceof DbError) {
                    if (e.type === dbCommonErrors.uniqueViolation) {
                        throw new AppError(errors.conflict, "Could not create process",
                            `Process of candidate ${candidateId} in request ${requestId} already exists`, e.stack)
                    }
                    if (e.type === dbCommonErrors.foreignKeyViolation) {
                        throw new AppError(errors.invalidArguments, "Could not create process",
                            "The arguments you supplied are not valid. Try again with valid arguments.", e.stack)
                    }
                }
                throw e;
            }

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

    async function getProcessesByRequestId({requestId}) {
        const candidates = await candidateDb.getCandidatesByRequestId({requestId});

        const processes = await Promise.all(candidates.map(async (candidate) => {
            const processCurrentPhase = await processPhaseDb.getProcessCurrentPhase({
                requestId,
                candidateId: candidate.id
            })
            const processDetails = await processDb.getProcessStatusAndTimestamp({requestId, candidateId: candidate.id})
            return {
                candidate: ({
                    id: candidate.id,
                    name: candidate.name
                }),
                status: processDetails.status,
                timestamp: processDetails.timestamp,
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
        const process = await processDb.getProcessStatusAndTimestamp({candidateId: candidateId, requestId: requestId})
        if (!process) {
            throw new AppError(errors.notFound, "Process not found",
                `Process of candidate ${candidateId} in request ${requestId} does not exist`)
        }
        if (process.timestamp !== timestamp) {
            throw new AppError(errors.conflict, "Process not updated",
                `Process of candidate ${candidateId} in request ${requestId} has already been updated`)
        }

        return await transaction(async (client) => {
            let newTimestamp, processPhasesDetails
            // Trying to update request
            try {
                processPhasesDetails = await updateProcessCurrentPhase({requestId, candidateId, newPhase, client})
                await updateProcessInfoValues({requestId, candidateId, infoArray, client})
                await updateUnavailableReason({requestId, candidateId, unavailableReason, client})
                newTimestamp = await processDb.updateProcess({requestId, candidateId, timestamp, status, client})
            } catch (e) {
                if (e instanceof DbError) {
                    if (e.type === dbCommonErrors.foreignKeyViolation) {
                        throw new AppError(errors.invalidArguments, "Could not update process",
                            "The arguments you supplied are not valid. Try again with valid arguments.", e.stack)
                    }
                }
                throw e;
            }

            if (!newTimestamp)
                throw new AppError(errors.conflict,
                    "Process not updated",
                    `Process of candidate ${candidateId} in request ${requestId} has already been updated`)


            if ((status && status !== process.status) ||
                (newPhase && processPhasesDetails && processPhasesDetails.currentPhase !== processPhasesDetails.oldPhase)) {
                // If either status or phase of the process has changed, we will need to email stakeholders about the changes
                // Get more details about the request and candidate to properly alert users
                const candidate = await candidateDb.getCandidateById({id: candidateId, client})
                const request = await requestDb.getRequestById({id: requestId, client})

                // Email stakeholders if the candidate's process status has been updated
                if (status) {
                    await emailService.notifyStatus({
                        id: requestId,
                        oldStatus: process.status,
                        newStatus: status,
                        candidate,
                        request
                    })
                }
                // Email stakeholders if the candidate's process current phase has been updated
                if (newPhase) {
                    await emailService.notifyMoved({
                        id: requestId, oldPhase: processPhasesDetails.oldPhase,
                        newPhase: processPhasesDetails.currentPhase,
                        candidate,
                        request
                    })
                }
            }

            return {
                newTimestamp
            }
        })

    }

    async function getProcessDetail({requestId, candidateId}) {
        const processDetails = await processDb.getProcessStatusAndTimestamp({requestId, candidateId})

        if (!processDetails) {
            throw new AppError(errors.notFound, "Process not found",
                `Process of candidate ${candidateId} in request ${requestId} does not exist`)
        }

        const currentPhase = await processPhaseDb.getProcessCurrentPhase({requestId, candidateId})

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
                let info = processInfos.find(procInfo => procInfo.name === phaseInfo.name);
                return {
                    name: phaseInfo.name,
                    value: info ? info.value : null
                }
            })
            return procPhase
        }))

        return {
            timestamp: processDetails.timestamp,
            status: processDetails.status,
            unavailableReason: reason ? reason.unavailableReason : null,
            currentPhase: currentPhase ? currentPhase.currentPhase : null,
            phases: processDetailedPhases
        }
    }

    async function updateUnavailableReason({requestId, candidateId, unavailableReason, client}) {
        if (!unavailableReason) return;
        const currentReason = await processUnavailableReasonDb.getProcessUnavailableReason({requestId, candidateId})

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

    async function updateProcessCurrentPhase({requestId, candidateId, newPhase, client}) {
        if (!newPhase) return;
        // Get process related workflow and the workflow's phases
        const {workflow} = await requestDb.getRequestById({id: requestId, client})
        const workflowPhases = await phaseDb.getPhasesByWorkflow({workflow, client})

        // Check if newPhase exists in the current workflow
        const validPhase = workflowPhases.find(phase => phase.phase === newPhase)
        if (!validPhase) {
            throw new AppError(errors.businessLogic,
                "Invalid Phase",
                `Phase ${newPhase} does not exist in the request workflow(${workflow})`)
        }

        // Get process current phase
        const currentPhase = await processPhaseDb.getProcessCurrentPhase({requestId, candidateId, client})

        // Check process current phase
        if (currentPhase.currentPhase === newPhase) return;

        const processExistingPhases = await processPhaseDb.getProcessPhases({requestId, candidateId, client})

        // If phase to transition (newPhase) does not exist in the process list of phases, then
        // we must insert the newPhase in the list of the process phases.
        if (!processExistingPhases.find(procPhase => procPhase.phase === newPhase)) {
            await processPhaseDb.addPhaseToProcess({
                requestId,
                candidateId,
                client,
                phase: newPhase
            })
        }
        await processPhaseDb.updateProcessCurrentPhase({
            requestId,
            candidateId,
            phase: newPhase,
            client
        })

        return {
            oldPhase: currentPhase.currentPhase,
            currentPhase: newPhase
        }
    }

    async function updateProcessInfoValues({requestId, candidateId, infoArray, client}) {
        if (!infoArray || !Array.isArray(infoArray) || infoArray.length === 0) return

        // Get process details
        const processInfos = await processInfoDb.getProcessInfos({requestId, candidateId, client})

        await Promise.all(infoArray.map(async info => {
            const infoFound = processInfos.find(procInfo => procInfo.name === info.name)
            if (!infoFound) {
                await processInfoDb.createProcessInfo({
                    requestId,
                    candidateId,
                    infoName: info.name,
                    infoValue: `${info.value}`,
                    client
                })
            } else {
                if (infoFound.value !== info.value) {
                    await processInfoDb.updateProcessInfoValue({
                        requestId,
                        candidateId,
                        infoName: info.name,
                        infoValue: `${info.value}`,
                        client
                    })
                }
            }
        }))
    }

    async function updateProcessPhaseNotes({requestId, candidateId, phase, notes, timestamp}) {
        const process = await processDb.getProcessStatusAndTimestamp({candidateId: candidateId, requestId: requestId})
        if (!process) {
            throw new AppError(errors.notFound, "Process not found",
                `Process of candidate ${candidateId} in request ${requestId} does not exist`)
        }
        if (process.timestamp !== timestamp) {
            throw new AppError(errors.conflict, "Process not updated",
                `Process of candidate ${candidateId} in request ${requestId} has already been updated`)
        }
        return await transaction(async (client) => {
            const phaseUpdated = await processPhaseDb.updatePhaseOfProcess({
                requestId, candidateId, phase, notes, client
            })
            if (!phaseUpdated) {
                throw new AppError(errors.notFound,
                    'Could not Update Process Notes',
                    `Phase ${phase} of candidate ${candidateId} process in request ${requestId} does not exist`)
            }
            const newTimestamp = await processDb.updateProcess({
                requestId: requestId,
                candidateId: candidateId,
                timestamp: timestamp,
                client: client
            })


            if (!newTimestamp) {
                throw new AppError(errors.conflict, 'Could not Update Process Notes',
                    'The process notes have already been updated')
            }

            return {
                newTimestamp
            }
        })
    }

}
