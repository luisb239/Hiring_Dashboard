'use strict';

const
    config = require('../common/config/config'),
    app = require('express')(),
    authization = require('../authization'),
    request = require('supertest')

var modulesFunctionalities

//if something is not working dont forget to add environment variable in your system or in your IDE: NODE_ENV=testing
//if running test alone make sure to add await in the end of test, running all tests will make them run in parallel
describe("Module testing", () => {

    beforeAll(() => {
        modulesFunctionalities = await authization.setup(
            {
                app,
                db: config.testing,
                rbac_opts: {}
            }
        )

        return modulesFunctionalities;
    });


    test("test user-dal creation ", async () => {

        const testUser = {
            username: 'test',
            password: 'test'
        }

        const createdUser = await modulesFunctionalities.user.create(testUser.username, testUser.password)
        modulesFunctionalities.user.delete(createdUser.id)

        expect(createdUser.username === testUser.username).toBeTruthy()

    });
});




