'use strict'

const AppError = require('../errors/app-error.js')
const errors = require('../errors/common-errors.js')

module.exports = (candidateDb, profilesDb) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        createCandidate: createCandidate,
    }

    async function getCandidates({available = null} = {}) {

        const candidates = await candidateDb.getCandidates({available})

        return {
            candidates: candidates
        }
    }

    async function getCandidateById({ id }) {
        if (!id)
            throw new AppError(errors.missingInput, "You must supply a candidate id")

        const candidateFound = await candidateDb.getCandidateById({id})

        if (!candidateFound)
            throw new AppError(errors.resourceNotFound, "Candidate not found")

        const profiles = await profilesDb.getCandidateProfiles({candidateId: id})

        return {
            candidate: candidateFound,
            profiles: profiles
        }
    }


    // TODO
    async function createCandidate({name, cv = null, available = true, profileInfo = null} = {}) {
        if (!name)
            throw new AppError(errors.missingInput, "You must supply a name")

        const candidate = await candidateDb.createCandidate({name, cv, available, profileInfo})
        return {candidate: candidate}
    }
}
