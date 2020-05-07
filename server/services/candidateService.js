'use strict'

const AppError = require('../utils/errors/app_error.js')
const errors = require('../utils/errors/errors_type.js')

module.exports = (db) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        getCandidatesByRequestId: getCandidatesByRequestId,
        createCandidate: createCandidate,
        getCandidatesByRequestAndPhase: getCandidatesByRequestAndPhase
    }

    async function getCandidates({available = null} = {}) {
        return await db.getCandidates({available})
    }

    async function getCandidateById({ id }) {
        if (!id)
            throw new AppError(errors.missingInput, "You must supply a candidate id")

        const candidateFound = await db.getCandidateById({id})

        if (!candidateFound)
            throw new AppError(errors.resourceNotFound, "Candidate not found")

        return candidateFound
    }

    async function getCandidatesByRequestId({ requestId, available = null } = {}) {
        if (!requestId)
            throw new AppError(errors.missingInput, "You must supply a request id")

        return await db.getCandidatesByRequestId({requestId, available})
    }

    async function createCandidate({ name, cv = null, available = true, profileInfo = null } = {}) {
        if (!name)
            throw new AppError(errors.missingInput, "You must supply a name")

        return await db.createCandidate({name, cv, available, profileInfo})
    }

    async function getCandidatesByRequestAndPhase({request, phase}) {
        return await db.getCandidatesByRequestAndPhase({request, phase})
    }

}
