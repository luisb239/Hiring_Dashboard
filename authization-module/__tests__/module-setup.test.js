'use strict';

const
    config = require('../common/config/config'),
    app = require('express')(),
    authization = require('../authization'),
    request = require('supertest')


//if something is not working dont forget to add environment variable in your system or in your IDE: NODE_ENV=testing
//if running test alone make sure to add await in the end of test, running all tests will make them run in parallel
describe("Module setup testing", () => {


    test("check if it's possible to run functions without permissions ", async () => {
        const funcs = await authization.setup(
            app,
            {
                "host": "eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
                "port": 3306,
                "user": "jvp56pl2nbv1v9pw",
                "password": "pv9t6oy23bsv65ri",
                "connectionLimit": 5,
                "database": "r15dtqer5c72jvex",
                "sgbd": "mariadb"
            },
            {}
        )

        funcs.class.getAll()

    });
});




