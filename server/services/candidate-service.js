'use strict'

const AppError = require('../errors/app-error.js')
const errors = require('../errors/common-errors.js')

module.exports = (candidateDb, profilesDb, processDb) => {

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

        const candidateFound = await candidateDb.getCandidateById({id})

        if (!candidateFound)
            throw new AppError(errors.notFound, "Candidate not found", `Candidate with id ${id} does not exist`)

        const profiles = await profilesDb.getCandidateProfiles({candidateId: id})

        const processes = await processDb.getCandidateProcesses({candidateId: id})

        return {
            candidate: candidateFound,
            profiles: profiles,
            processes: processes
        }
    }


    // TODO
    async function createCandidate({name, cv = null, available = true, profileInfo = null} = {}) {
        const candidate = await candidateDb.createCandidate({name, cv, available, profileInfo})
        return {candidate: candidate}
    }
}
