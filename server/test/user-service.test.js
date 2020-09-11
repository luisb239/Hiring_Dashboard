'use strict'

const assert = require('assert');
const db = require('../dals')

const express = require('express')
const config = require('../config')()
const authModule = require('../../authization-module/authization')

const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

describe('Testing user-service', function () {
    this.timeout(5000)
    let service;
    before(async () => {
        const auth = await authModule.setup({app: express(), db: config.dbOptions, rbac_opts: config.jsonObj})
        service = require('../services/user-service')(db.user, db.role, auth)
    })

    describe('Testing getUsers', () => {
        it('should return an array of users with the given role', async () => {
            const res = await service.getUsers({roleId: 1})
            assert.ok(Array.isArray(res.users))
        })

        it('should return an empty array when the given role does not exist', async () => {
            const res = await service.getUsers({roleId: 999})
            assert.strictEqual(res.users.length, 0)
        });

    })
    describe('Testing getRoleByName', () => {
        it('should return details of the given role', async () => {
            const roleInfo = await service.getRoleByName({role: 'recruiter'})
            assert.ok(roleInfo.id && roleInfo.role)
        })
        it("should throw a 'NotFound' exception if the given role does not exist", async () => {
            try {
                await service.getRoleByName({role: 'Non Existent Role'})
            } catch (e) {
                assert.ok(e instanceof AppError)
                assert.strictEqual(e.commonError, errors.notFound)
            }
        });
    })
    describe('Testing getCurrentUserRoles', () => {
        it("should return an array with the user's roles", async () => {
            const userRoles = await service.getUserRoles({userId: 1})
            assert.ok(Array.isArray(userRoles))
            assert.ok(userRoles.length > 0)
        })
        it('should return an empty array if the given user does not exist', async () => {
            const userRoles = await service.getUserRoles({userId: 999})
            assert.ok(Array.isArray(userRoles))
            assert.strictEqual(userRoles.length, 0)
        });
    })
})
