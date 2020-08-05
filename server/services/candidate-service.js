'use strict'

const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')

module.exports = (candidateDb, profilesDb, processDb) => {

    return {
        getCandidates: getCandidates,
        getCandidateById: getCandidateById,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        getCandidateCv: getCandidateCv,
        addCandidateProfiles: addCandidateProfiles,
        removeCandidateProfile: removeCandidateProfile
    }

    async function getCandidates({ available = null, profiles = null }) {
        return {
            candidates: await candidateDb.getCandidates({available, profiles}),
        }
    }

    async function getCandidateById({ id }) {

        const candidateFound = await candidateDb.getCandidateById({ id })

        if (!candidateFound)
            throw new AppError(errors.notFound,
                "Candidate not found", `Candidate with id ${id} does not exist`)

        const profiles = await profilesDb.getCandidateProfiles({ candidateId: id })

        const processes = await processDb.getCandidateProcesses({ candidateId: id })

        return {
            candidate: candidateFound,
            profiles: profiles,
            processes: processes
        }
    }

    async function updateCandidate({
                                       id, cvFileName = null, cvMimeType = null,
                                       cvFileBuffer = null, cvEncoding = null, profileInfo = null, available = null,
                                       profiles = null
                                   }) {
        // Convert string to boolean
        if (available)
            available = (available === 'true')
        // Convert string to array
        if (profiles)
            profiles = JSON.parse(profiles)

        await candidateDb.updateCandidate({
            id: id,
            profileInfo: profileInfo,
            available: available,
            cvFileName: cvFileName,
            cvMimeType: cvMimeType,
            cvBuffer: cvFileBuffer,
            cvEncoding: cvEncoding
        })

        if (profiles && profiles.length > 0) {
            await addCandidateProfiles({id, profiles})
        }
    }

    async function createCandidate({ name, profileInfo = null, cvFileName, cvMimeType, cvFileBuffer, cvEncoding }) {
        const candidate = await candidateDb.createCandidate({
            name: name,
            profileInfo: profileInfo,
            cvBuffer: cvFileBuffer,
            cvMimeType: cvMimeType,
            cvFileName: cvFileName,
            cvEncoding: cvEncoding
        })
        return {
            id: candidate.id
        }
    }

    /**
     * Add profiles to candidate info
     * @param id : number
     * @param profiles : [String]
     * @returns {Promise<void>}
     */
    async function addCandidateProfiles({ id, profiles }) {
        await Promise.all(profiles.map(async prof => {
            await profilesDb.addProfileToCandidate({
                candidateId: id,
                profile: prof
            })
        }))
    }

    /**
     * Remove profile from candidate info
     * @param id : number
     * @param profile : String
     * @returns {Promise<void>}
     */
    async function removeCandidateProfile({ id, profile }) {
        await profilesDb.deleteProfileFromCandidate({
            candidateId: id,
            profile: profile
        })
    }

    async function getCandidateCv({ id }) {
        const cvFileInfo = await candidateDb.getCandidateCvInfo({ id })

        if (!cvFileInfo) {
            throw new AppError(errors.notFound,
                "Candidate Cv Not Found",
                "Candidate does not exist, or doesnt have a cv")
        }

        return {
            cv: cvFileInfo.cvBuffer,
            mimeType: cvFileInfo.cvMimeType,
            fileName: cvFileInfo.cvFileName,
            encoding: cvFileInfo.cvEncoding
        }
    }
}
