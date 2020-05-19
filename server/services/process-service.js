'use strict'

const errors = require('../errors/common-errors.js')
const AppError = require('../errors/app-error.js')

module.exports = (requestDb, candidateDb, processDb) => {

    return {
        getProcessDetail: getProcessDetail
    }

    async function getProcessDetail({requestId, candidateId}) {
        if (!parseInt(requestId))
            throw new AppError(errors.invalidInput, "Invalid Request ID", "Request ID must be of integer type")

        if (!parseInt(candidateId))
            throw new AppError(errors.invalidInput, "Invalid Candidate ID", "Candidate ID must be of integer type")

        if (!await requestDb.getRequestById({id: requestId}))
            throw new AppError(errors.resourceNotFound, "Request Not Found", `Request with id ${requestId} does not exist`)

        if (!await candidateDb.getCandidateById({id: candidateId}))
            throw new AppError(errors.resourceNotFound, "Candidate Not Found", `Candidate with id ${candidateId} does not exist`)

        const status = await processDb.getProcessStatus({requestId, candidateId})

        const reasons = await processDb.getProcessUnavailableReasons({requestId, candidateId})

        const phases = await processDb.getPhasesOfProcess({requestId, candidateId})

        const infos = await processDb.getProcessInfos({requestId, candidateId})

        return {
            status: status.status,
            unavailableReasons: reasons,
            phases: phases,
            infos: infos.map(info => ({name: info.name, value: info.value.value}))
        }
    }

}
