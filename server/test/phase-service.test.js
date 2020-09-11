'use strict'
const assert = require('assert');
const db = require('../dals')
const service = require('../services/phase-service')(db.phase, db.info)
const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

describe('Testing phase-service', () => {
    describe('Testing getPhases', () => {
        it('should return an object containing an array of phases', async () => {
            const res = await service.getPhases()
            assert.ok(Array.isArray(res.phases),)
        });
    })
    describe('Testing getPhase', () => {
        it("should return an object containing an array of the phase's infos", async () => {
            const res = await service.getPhase({phase: 'First Interview'})
            assert.ok(Array.isArray(res.infos))
        });
        it('should throw a "Not Found" exception if the phase does not exist', async () => {
            try {
                await service.getPhase({phase: 'Non Existent Phase'})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
    })
})
