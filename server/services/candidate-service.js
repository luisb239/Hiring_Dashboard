'use strict'

const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')

module.exports = (candidateDb, profilesDb, processDb) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        getCandidateCv: getCandidateCv
    }

    async function getCandidates({available = null, profiles = null}) {
        const candidates = await candidateDb.getCandidates({available, profiles})

        return {
            candidates: candidates,
        }
    }

    async function getCandidateById({id}) {

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

    //TODO
    async function updateCandidate({id, available}) {
        await candidateDb.updateCandidate({id, available})
    }

    async function createCandidate({name, cvFileName, cvMimeType, cvFileBuffer}) {
        const candidate = await candidateDb.createCandidate({
            name: name,
            cvBuffer: cvFileBuffer,
            cvMimeType: cvMimeType,
            cvFileName: cvFileName,
        })
        return {
            id: candidate.id
        }
    }

    async function getCandidateCv({id}) {
        const cvFileInfo = await candidateDb.getCandidateCvInfo({
            id
        })

        if (!cvFileInfo)
            throw new AppError(errors.notFound, "Candidate Cv Not Found", "Candidate does not exist, or doesnt have a cv")
        return {
            cv: cvFileInfo.cvBuffer,
            mimeType: cvFileInfo.cvMimeType,
            fileName: cvFileInfo.cvFileName
        }
    }
}
