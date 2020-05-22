'use strict'

const errors = require('../errors/common-errors.js')
const AppError = require('../errors/app-error.js')

module.exports = (requestDb, candidateDb, processDb) => {

    return {
        getProcessDetail: getProcessDetail,
        getProcessesByRequestId: getProcessesByRequestId
    }

    async function getProcessesByRequestId({requestId, inCurrentPhase = null}) {

        if (!parseInt(requestId))
            throw new AppError(errors.invalidInput, "Invalid Request ID", "Request ID must be of integer type")

        if (!await requestDb.getRequestById({id: requestId}))
            throw new AppError(errors.notFound, "Request Not Found", `Request with id ${requestId} does not exist`)

        const candidates = await candidateDb.getCandidatesByRequestId({requestId});

        const processes = await Promise.all(candidates.map(async (candidate) => ({
            candidate: ({id: candidate.id, name: candidate.name}),
            phases: await processDb.getPhasesOfProcess({
                requestId,
                candidateId: candidate.id,
                currentPhase: inCurrentPhase
            })
                .then(phases => phases.map(p => ({phase: p.phase})))
        })))

        return {
            processes: processes
        }
    }

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

}
