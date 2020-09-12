'use strict'

const assert = require('assert')
const db = require('../dals')
const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

const emailServiceMock = {
    notifyStatus: ({id, oldStatus, newStatus, candidate, request}) => {
        console.log(`EmailService.notifyStatus(${id}, ${oldStatus}, ${newStatus}, ${candidate}, ${request})`)
    },
    notifyMoved: ({id, oldPhase, newPhase, candidate, request}) => {
        console.log(`EmailService.notifyMoved(${id}, ${oldPhase}, ${newPhase}, ${candidate}, ${request})`)
    },
    notifyAssigned: ({userId, request, currentUsername}) => {
        console.log(`EmailService.notifyAssigned(${userId}, ${request}, ${currentUsername})`)
    }
}

const service = require('../services/process-service')
(db.request, db.candidate, db.process, db.phase, db.info, db.processUnavailableReason, db.processPhases, db.processInfo,
    db.reasons, db.status, emailServiceMock, db.transaction)

describe('Testing process-service', function () {
    describe('Testing getAllStatus', function () {
        it('should return an object containing all status existent in database', async () => {
            const res = await service.getAllStatus()
            assert.ok(Array.isArray(res.status))
            assert.ok(res.status.length)
        });
    })
    describe('Testing getUnavailableReasons', function () {
        it('should return an object containing all unavailable reasons in database', async () => {
            const res = await service.getUnavailableReasons()
            assert.ok(Array.isArray(res.unavailableReasons))
            assert.ok(res.unavailableReasons.length)
        });
    })
    describe('Testing createProcess', function () {
        it('should create a process for the given candidate in the request', async () => {
            const candidateId = 1, requestId = 5;
            await service.createProcess({candidateId: candidateId, requestId: requestId})
        });
        it("should throw 'Conflict' exception if the process already exists", async () => {
            try {
                const candidateId = 1, requestId = 6;
                await service.createProcess({candidateId: candidateId, requestId: requestId})
                await service.createProcess({candidateId: candidateId, requestId: requestId})
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        })
        it("should throw 'Invalid Arguments' exception if the process is not valid to be created", async () => {
            try {
                await service.createProcess({requestId: 9999, candidateId: 9999})
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        })
    })
    describe('Testing getProcessesByRequestId', function () {
        it('should return an object containing all processes of the given request', async () => {
            const res = await service.getProcessesByRequestId({requestId: 1})
            assert.ok(res.processes)
            assert.ok(Array.isArray(res.processes))
        });
        it('should return an object with no processes if the given request does not exist', async () => {
            const res = await service.getProcessesByRequestId({requestId: 999})
            assert.ok(res.processes)
            assert.ok(Array.isArray(res.processes))
            assert.strictEqual(res.processes.length, 0)
        });
    })
    describe('Testing updateProcess', function () {
        const candidateId = 1, requestId = 1
        it('should successfully update the process when the supplied arguments are valid', async () => {
            const process = await service.getProcessDetail({requestId: requestId, candidateId: candidateId})
            await service.updateProcess({
                candidateId: candidateId,
                requestId: requestId,
                status: 'Onhold',
                timestamp: process.timestamp
            })
        });
        it("should throw 'Not Found' exception if the process could not be found", async () => {
            try {
                await service.updateProcess({
                    candidateId: 9999,
                    requestId: 99999,
                    status: 'Placed',
                    timestamp: process.timestamp
                })
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
        it("should throw 'Invalid Arguments' exception if any of the supplied arguments are not valid", async () => {
            const process = await service.getProcessDetail({requestId: requestId, candidateId: candidateId})
            try {
                await service.updateProcess({
                    candidateId: candidateId,
                    requestId: requestId,
                    status: 'RANDOM',
                    timestamp: process.timestamp
                })
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        });
        it("should throw 'Conflict' if timestamps do not match", async () => {
            try {
                await service.updateProcess({
                    candidateId: candidateId,
                    requestId: requestId,
                    status: 'Placed',
                    timestamp: '1234567890'
                })
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        });
    })
    describe('Testing getProcessDetail', function () {
        const candidateId = 1, requestId = 1
        it('should return an object containing all of the process details when the supplied arguments are valid', async () => {
            const processDetails = await service.getProcessDetail({candidateId: candidateId, requestId: requestId})
            assert.ok(processDetails.status && processDetails.timestamp && processDetails.currentPhase
                && processDetails.unavailableReason !== undefined && Array.isArray(processDetails.phases))
        });
        it("should throw an 'Invalid Arguments' exception if the process does not exist", async () => {
            try {
                await service.getProcessDetail({candidateId: 9999, requestId: 9999})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
    })
    describe('Testing updateProcessPhaseNotes', function () {
        const candidateId = 1, requestId = 1
        it('should update the notes of the supplied valid phase', async () => {
            const notes = 'This notes have been updated as you can see'
            const phase = 'First Interview'
            const processDetails = await service.getProcessDetail({candidateId: candidateId, requestId: requestId})
            const res = await service.updateProcessPhaseNotes({
                requestId: requestId, candidateId: candidateId,
                phase: phase, notes: notes, timestamp: processDetails.timestamp
            })
            const newProcessDetails = await service.getProcessDetail({candidateId: candidateId, requestId: requestId})
            assert.strictEqual(notes, newProcessDetails.phases.find(p => p.phase === phase).notes)
        });
        it("should throw 'Not Found' exception if the given process does not exist", async () => {
            try {
                await service.updateProcessPhaseNotes({
                    requestId: 999999, candidateId: 99999,
                    phase: 'Random', notes: 'Random notes', timestamp: '2020-01-01'
                })
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
        it("should throw 'Not Found' exception if the given process exists, but the phase does not", async () => {
            try {
                const processDetails = await service.getProcessDetail({candidateId: candidateId, requestId: requestId})
                await service.updateProcessPhaseNotes({
                    requestId: requestId, candidateId: candidateId,
                    phase: 'Non existent phase', notes: 'Random notes', timestamp: processDetails.timestamp
                })
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
    })
})

