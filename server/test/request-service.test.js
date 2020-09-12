'use strict'

const assert = require('assert')
const db = require('../dals')

const express = require('express')
const config = require('../config')()
const authModule = require('../../authization-module/authization')

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

describe('Testing request-service', function () {
    this.timeout(5000)
    let service;
    before(async () => {
        const auth = await authModule.setup({app: express(), db: config.dbOptions, rbac_opts: config.jsonObj})
        service = require('../services/request-service')
        (db.request, db.process, db.requestLanguage, auth, db.candidate, emailServiceMock, db.transaction)
    })

    describe('Testing getRequests', function () {
        it('should return an object with an array of requests, with the size of ' +
            'the array being lower or equal to pageSize', async () => {
            const pageSize = 10;
            const requests = await service.getRequests({pageNumber: 0, pageSize: pageSize})
            assert.ok(Array.isArray(requests.requests))
            assert.ok(requests.requests.length <= pageSize)
        })
        it('should return an object with an empty array if no requests match the supplied filters', async () => {
            const requests = await service.getRequests({skill: 'Random String 123'})
            assert.ok(Array.isArray(requests.requests))
            assert.strictEqual(requests.requests.length, 0)
        })
    })

    describe('Testing countRequests', function () {
        it('should return an object with the count of requests that match the supplied filters', async () => {
            const allRequests = await service.getRequests()
            const res = await service.countRequests()
            assert.strictEqual(Number(res.count), allRequests.requests.length)
        })
        it('should return an object with count equal to 0 if no requests match the supplied filters', async () => {
            const res = await service.countRequests({
                skill: 'Non Existent Skill',
                state: 'Non Existent State'
            })
            assert.strictEqual(Number(res.count), 0)
        });
    })

    describe('Testing getRequestById', function () {
        it('should return an object containing detailed information of the request with the given id', async () => {
            const requestDetails = await service.getRequestById({id: 1})
            assert.ok(requestDetails.request && requestDetails.userRoles
                && requestDetails.processes && requestDetails.languages)
        })
        it("should thrown a 'Not Found' exception if the request with the given id does not exist", async () => {
            try {
                await service.getRequestById({id: 999999})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        })
    })

    describe('Testing createRequest', function () {
        it('should create a request with the given information and return its id inside an object', async () => {
            const newRequest = await service.createRequest({
                quantity: 2, description: 'Testing', targetDate: 'January', skill: 'IS',
                project: 'Not defined yet', profile: '.Net', workflow: 'Software Development'
            })
            assert.ok(newRequest.id)
        });
        it("should throw 'Invalid Arguments' exception if the given arguments supplied are not valid ", async () => {
            try {
                await service.createRequest({
                    quantity: 2,
                    description: 'Should not be created',
                    targetDate: 'Random String',
                    skill: 'Random String',
                    project: 'Random String',
                    profile: 'Random String',
                    workflow: 'Random String'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        })
    })

    describe('Testing updateRequest', function () {
        const descriptionToUpdate = 'New Description', requestId = 1;
        it('should update the request if all arguments supplied are valid, returning its new timestamp', async () => {
            const request = await service.getRequestById({id: requestId})
            const res = await service.updateRequest({
                id: requestId, description: descriptionToUpdate, timestamp: request.request.timestamp
            })
            assert.ok(res.newTimestamp)

            const newRequest = await service.getRequestById({id: requestId})
            assert.strictEqual(descriptionToUpdate, newRequest.request.description)
        })
        it("should throw 'Invalid Arguments' exception if the supplied arguments are not valid ", async () => {
            const request = await service.getRequestById({id: requestId})
            try {
                await service.updateRequest({
                    id: requestId, description: descriptionToUpdate, timestamp: request.request.timestamp
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        })
        it("should throw 'Conflict' exception if timestamps do not match", async () => {
            try {
                await service.updateRequest({
                    id: requestId, description: descriptionToUpdate, timestamp: '2020-12-31 23:59:59.9999'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        });
    })

    describe('Testing addUserToRequest', function () {
        it('should associate the user and his role in the given request', async () => {
            const requestId = 1, userId = 1, roleId = 1
            await service.addUserToRequest({
                requestId: requestId,
                userId: userId,
                roleId: roleId,
                currentUsername: 'admin'
            })
            const userRolesInRequest = await db.request.getUserRolesInRequest({requestId: requestId})
            assert.ok(Array.isArray(userRolesInRequest))
            assert.ok(userRolesInRequest.find(userRole => userRole.userId === userId && userRole.roleId === roleId))
        })
        it("should throw 'Conflict' exception if the user and his role are already associated in the given request", async () => {
            const requestId = 2, userId = 1, roleId = 1
            try {
                await service.addUserToRequest({
                    requestId: requestId,
                    userId: userId,
                    roleId: roleId,
                    currentUsername: 'admin'
                })
                await service.addUserToRequest({
                    requestId: requestId,
                    userId: userId,
                    roleId: roleId,
                    currentUsername: 'admin'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        })
        it("should throw 'Invalid Arguments' exception if arguments supplied are not valid", async () => {
            const requestId = 99999, userId = 99999, roleId = 99999
            try {
                await service.addUserToRequest({
                    requestId: requestId,
                    userId: userId,
                    roleId: roleId,
                    currentUsername: 'admin'
                })
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        });
    })

    describe('Testing addLanguageToRequest', function () {
        it('should add a language requirement to given request', async () => {
            const language = 'English', mandatory = true
            const {id} = await service.createRequest({
                quantity: 2, description: 'Just for testing', targetDate: 'January', skill: 'IS',
                project: 'Not defined yet', profile: '.Net', workflow: 'Software Development'
            })
            await service.addLanguageToRequest({requestId: id, language: language, isMandatory: mandatory})
            const requestLanguagesRequirements = await db.requestLanguage.getRequestLanguages({requestId: id})
            assert.ok(Array.isArray(requestLanguagesRequirements))
            assert.ok(requestLanguagesRequirements.find(l => l.requestId === id && l.language === language && l.isMandatory === mandatory))
        })
        it("should throw 'Conflict' exception if language requirement already exists in request ", async () => {
            try {
                const language = 'English', mandatory = true
                const {id} = await service.createRequest({
                    quantity: 2, description: 'Just for testing', targetDate: 'January', skill: 'IS',
                    project: 'Not defined yet', profile: '.Net', workflow: 'Software Development'
                })
                await service.addLanguageToRequest({requestId: id, language: language, isMandatory: mandatory})
                await service.addLanguageToRequest({requestId: id, language: language, isMandatory: mandatory})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.conflict)
            }
        })
        it("should throw 'Invalid Arguments' exception if arguments are not valid", async () => {
            try {
                await service.addLanguageToRequest({requestId: 9999, language: 'Norwegian', isMandatory: true})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.invalidArguments)
            }
        });
    })

    describe('Testing deleteLanguage', function () {
        it('should delete given language requirement from request', async () => {
            const language = 'English', mandatory = true
            const {id} = await service.createRequest({
                quantity: 2, description: 'Just for testing', targetDate: 'January', skill: 'IS',
                project: 'Not defined yet', profile: '.Net', workflow: 'Software Development'
            })
            await service.addLanguageToRequest({requestId: id, language: language, isMandatory: mandatory})
            await service.deleteLanguage({requestId: id, language: language, isMandatory: mandatory})
        });
    })
})



