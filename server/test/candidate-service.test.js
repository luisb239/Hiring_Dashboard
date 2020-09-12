'use strict'

const assert = require('assert')
const db = require('../dals')

const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

const service = require('../services/candidate-service')(db.candidate, db.profile, db.process, db.transaction)


describe('Testing candidate-service', () => {
    describe('Testing getCandidates', () => {
        it('should return an object with an array of candidates, with the size of ' +
            'the array being lower or equal to pageSize', async () => {
            const pageSize = 10;
            const candidates = await service.getCandidates({pageNumber: 0, pageSize: pageSize})
            assert.ok(Array.isArray(candidates.candidates))
            assert.ok(candidates.candidates.length <= pageSize)
        })
        it('should return an object with an empty array if no requests match the supplied filters', async () => {
            const candidates = await service.getCandidates({profiles: ['Random String 123']})
            assert.ok(Array.isArray(candidates.candidates))
            assert.strictEqual(candidates.candidates.length, 0)
        })
    })
    describe('Testing countCandidates', () => {
        it('should return an object with the count of candidates that match the supplied filters', async () => {
            const allCandidates = await service.getCandidates()
            const res = await service.countCandidates()
            assert.strictEqual(Number(res.count), allCandidates.candidates.length)
        })
        it('should return an object with count equal to 0 if no requests match the supplied filters', async () => {
            const res = await service.countCandidates({
                profiles: ['Random String 123']
            })
            assert.strictEqual(Number(res.count), 0)
        });
    })

    describe('Testing getCandidatesById', function () {
        it('should return an object containing detailed information of the candidate with the given id', async () => {
            const candidateDetails = await service.getCandidateById({id: 1})
            assert.ok(candidateDetails.candidate && candidateDetails.profiles
                && candidateDetails.processes)
        })
        it("should thrown a 'Not Found' exception if the candidate with the given id does not exist", async () => {
            try {
                await service.getCandidateById({id: 999999})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        })
    })

    describe('Testing updateCandidate', function () {
        const profileInfoToUpdate = 'New Profile Information', candidateId = 1;
        it('should update the candidate if all arguments supplied are valid, returning its new timestamp', async () => {
            const candidate = await service.getCandidateById({ id: candidateId })
            const res = await service.updateCandidate({
                id: candidateId, profileInfo: profileInfoToUpdate, timestamp: candidate.candidate.timestamp
            })
            assert.ok(res.newTimestamp)

            const newCandidate = await service.getCandidateById({ id: candidateId })
            assert.strictEqual(profileInfoToUpdate, newCandidate.candidate.profileInfo)
        })
        it("should throw 'Conflict' exception if timestamps do not match", async () => {
            try {
                await service.updateCandidate({
                    id: candidateId, profileInfo: profileInfoToUpdate, timestamp: '2020-12-31 23:59:59.9999'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        });

    })

    describe('Testing removeCandidateProfile', function () {
        const profileToRemove = 'Analista Funcional', candidateId = 1;
        it('should remove the profile supplied if it exists, returning the row count', async () => {
            const candidate = await service.getCandidateById({
                id: candidateId
            })
            if(!candidate.profiles.find(profile => profile.profile === profileToRemove)) {
                await service.addCandidateProfile({
                    id: candidateId,
                    profile: profileToRemove
                })
            }
            const res = await service.removeCandidateProfile({
                id: candidateId,
                profile: profileToRemove
            })
            assert.ok(res !== 0)
        })
        it("should throw 'Gone' exception if the supplied profile is not in candidate profiles", async () => {
            try {
                await service.removeCandidateProfile({
                    id: candidateId,
                    profile: profileToRemove
                })
                await service.removeCandidateProfile({
                    id: candidateId,
                    profile: profileToRemove
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.gone)
            }
        });
    })

    describe('Testing addCandidateProfile', function () {
        const profileToAdd = 'Analista Funcional', candidateId = 1;
        it('should add the profile supplied if its valid, returning the profile', async () => {
            const candidate = await service.getCandidateById({
                id: candidateId
            })
            if(candidate.profiles.find(profile => profile.profile === profileToAdd)) {
                await service.removeCandidateProfile({
                    id: candidateId,
                    profile: profileToAdd
                })
            }
            const res = await service.addCandidateProfile({
                id: candidateId,
                profile: profileToAdd
            })
            assert.strictEqual(res.profile, profileToAdd)
        })
        it("should throw 'Invalid Arguments' exception if the supplied arguments are not valid ", async () => {
            try {
                await service.addCandidateProfile({
                    id: candidateId,
                    profile: 'You dont exist, dont lie'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        })
        it("should throw 'Conflict' exception if profile is already associated", async () => {
            try {
                await service.addCandidateProfile({
                    id: candidateId, profile: profileToAdd
                })
                await service.addCandidateProfile({
                    id: candidateId, profile: profileToAdd
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        });
    })
})
