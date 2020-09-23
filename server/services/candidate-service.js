'use strict'

const uniqid = require('uniqid');
const AppError = require('./errors/app-error.js')
const errors = require('./errors/common-errors.js')
const DbError = require('../dals/errors/db-access-error')
const dbCommonErrors = require('../dals/errors/db-errors.js')

module.exports = (candidateDb, profilesDb, processDb, transaction) => {

    return {
        getCandidates: getCandidates,
        countCandidates: countCandidates,
        getCandidateById: getCandidateById,
        createCandidate: createCandidate,
        updateCandidate: updateCandidate,
        getCandidateCv: getCandidateCv,
        addCandidateProfile: addCandidateProfile,
        removeCandidateProfile: removeCandidateProfile
    }

    async function getCandidates({
                                     pageNumber = null, pageSize = null,
                                     notInRequest = null, available = null, profiles = null
                                 } = {}) {
        const candidates = await candidateDb.getCandidates({pageNumber, pageSize, notInRequest, available, profiles})

        return {
            candidates: candidates
        }
    }


    async function countCandidates({available = null, profiles = null, notInRequest = null} = {}) {
        const result = await candidateDb.countCandidates({available, profiles, notInRequest})
        return {count: result.count};
    }

    async function getCandidateById({id}) {

        const candidateFound = await candidateDb.getCandidateById({id})

        if (!candidateFound)
            throw new AppError(errors.notFound,
                "Candidate not found",
                `Candidate with id ${id} does not exist`)

        const profiles = await profilesDb.getCandidateProfiles({candidateId: id})

        const processes = await processDb.getCandidateProcesses({candidateId: id})

        return {
            candidate: candidateFound,
            profiles: profiles,
            processes: processes
        }
    }

    async function updateCandidate({
                                       id, cvFileName = null, cvMimeType = null,
                                       cvFileBuffer = null, cvEncoding = null, profileInfo = null,
                                       available = null, timestamp
                                   }) {
        // Convert string to boolean
        if (available)
            available = (available === 'true')

        const candidate = await candidateDb.getCandidateById({id: id})
        if (!candidate) {
            throw new AppError(errors.notFound, "Candidate not found",
                `Candidate with id ${id} does not exist`)
        }

        if (candidate.timestamp !== timestamp) {
            throw new AppError(errors.conflict, "Candidate not updated",
                `Candidate with id ${id} has already been updated`)
        }

        return await transaction(async (client) => {
            const newTimestamp = await candidateDb.updateCandidate({
                id: id,
                profileInfo: profileInfo,
                available: available,
                cvFileName: cvFileName,
                cvMimeType: cvMimeType,
                cvBuffer: cvFileBuffer,
                cvEncoding: cvEncoding,
                cvVersionId: cvFileName ? uniqid() : null,
                timestamp: timestamp,
                client: client
            })

            if (!newTimestamp)
                throw new AppError(errors.conflict,
                    "Conflict trying to update candidate",
                    `The information of candidate ${id} has already been updated`)
            return {
                newTimestamp
            }
        })
    }

    async function createCandidate({name, profileInfo = null, cvFileName, cvMimeType, cvFileBuffer, cvEncoding}) {
        const candidate = await candidateDb.createCandidate({
            name: name,
            profileInfo: profileInfo,
            cvBuffer: cvFileBuffer,
            cvMimeType: cvMimeType,
            cvFileName: cvFileName,
            cvEncoding: cvEncoding,
            cvVersionId: uniqid()
        })
        return {
            id: candidate.id
        }
    }

    async function addCandidateProfile({id, profile}) {
        try {
            await profilesDb.addProfileToCandidate({
                candidateId: id,
                profile: profile
            })
        } catch (e) {
            if (e instanceof DbError) {
                if (e.type === dbCommonErrors.uniqueViolation) {
                    throw new AppError(errors.conflict, "Could not add profile",
                        "The profile you supplied has already been added.", e.stack)
                }
                if (e.type === dbCommonErrors.foreignKeyViolation) {
                    throw new AppError(errors.invalidArguments, "Could not add profile",
                        "The profile you supplied is invalid.", e.stack)
                }
            }
            throw e;
        }
    }

    async function removeCandidateProfile({id, profile}) {
        const rows = await profilesDb.deleteProfileFromCandidate({
            candidateId: id,
            profile: profile
        })
        if (rows === 0) {
            throw new AppError(errors.gone,
                "Could not delete profile from candidate's profiles,",
                ` profile on candidate ${id} not found`)
        }
    }

    async function getCandidateCv({id}) {
        const cvFileInfo = await candidateDb.getCandidateCvInfo({id})

        if (!cvFileInfo) {
            throw new AppError(errors.notFound,
                "Candidate Cv Not Found",
                `Candidate with id ${id} does not exist, or does not have a cv`)
        }

        return {
            cv: cvFileInfo.cvBuffer,
            mimeType: cvFileInfo.cvMimeType,
            fileName: cvFileInfo.cvFileName,
            encoding: cvFileInfo.cvEncoding,
            versionId: cvFileInfo.cvVersionId
        }
    }
}
