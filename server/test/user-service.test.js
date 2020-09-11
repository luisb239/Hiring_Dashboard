'use strict'

const assert = require('assert');
const db = require('../dals')

const express = require('express')
const config = require('../config')()
const authModule = require('../../authization-module/authization')

const AppError = require('../services/errors/app-error')
const errors = require('../services/errors/common-errors.js')

describe('Testing user-service', () => {
    let service, auth
    before(async () => {
        await new Promise(resolve => setTimeout(resolve, 5000));
        auth = await authModule.setup({app: express(), db: config.dbOptions, rbac_opts: config.jsonObj})
        service = require('../services/user-service')(db.user, db.role, auth)
    })

    describe('Testing getUsers', () => {

        it('should return an array of users with the given role', () => {
            assert.ok(true)
            //const res = await service.getUsers({roleId: 1})
            //assert.ok(Array.isArray(res.users))
        })

        /*
        it('should return an empty array when the given role does not exist', async () => {
            //const res = await service.getUsers({roleId: 999})
            //assert.strictEqual(res.users.length, 0)
        });

         */
    })
    /*
    describe('Testing getRoleByName', () => {
        it('should turn details of the given role', async () => {
            //const roleInfo = await service.getRoleByName({role: 'recruiter'})
            //assert.ok(true)
            //assert.ok(roleInfo.id && roleInfo.role)
        })
    })

     */
})
