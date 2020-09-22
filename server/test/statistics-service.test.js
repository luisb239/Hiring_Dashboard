'use strict'
const assert = require('assert');
const db = require('../dals')
const service = require('../services/statistics-service')(db.statistics)
const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

describe('Testing statistics-service', () => {
    describe('Testing getStatistics', () => {
        it('should return an object containing an array of all the system statistics', async () => {
            const statistics = await service.getStatistics()
            assert.ok(Array.isArray(statistics))
        })
    })
    describe('Testing getUserStatisticsConfigs', () => {
        it("should return an array of the user's statistics configs", async () => {
            const userConfigs = await service.getUserStatisticsConfigs({userId: 2})
            assert.ok(Array.isArray(userConfigs))
        });
        it('should return an empty array if the user does not exist', async () => {
            const userConfigs = await service.getUserStatisticsConfigs({userId: 999})
            assert.ok(Array.isArray(userConfigs))
            assert.strictEqual(userConfigs.length, 0)
        });
    })
    describe('Testing getUserStatisticsConfigsDetails', () => {
        it("should throw 'NotFound' exception if the user, or his profile, does not exist", async () => {
            try {
                await service.getUserStatisticsConfigsDetails({userId: 999, profileName: "random string"})
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        })
    })
    describe('Testing saveUserStatisticsConfigs', () => {
        it('should add a config profile to an existing user', async () => {
            const id = 1;
            const profileName = "Merely a test";
            const createdConfig = await service.saveUserStatisticsConfigs({
                userId: id,
                name: profileName,
                configs: '{}'
            })
            assert.strictEqual(createdConfig.userId, id)
            assert.strictEqual(createdConfig.profileName, profileName)
        });
        it("should throw 'Not Found' exception if the user does not exist", async () => {
            const id = 999;
            const profileName = "Merely a test";
            try {
                await service.saveUserStatisticsConfigs({userId: id, name: profileName, configs: '{}'})
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        })
        it("should throw 'Conflict' exception if the user config profile already exists ", async () => {
            const id = 1;
            const profileName = "Merely a test";
            try {
                await service.saveUserStatisticsConfigs({userId: id, name: profileName, configs: '{}'})
                await service.saveUserStatisticsConfigs({userId: id, name: profileName, configs: '{}'})
                assert.fail()
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        });
    })
})
