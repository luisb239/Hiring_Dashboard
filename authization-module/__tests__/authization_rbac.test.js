'use strict';

var AuthizationRbac = require('../resources/authization-rbac')

const rbac_opts = {
    roles: ["DbManager", "guest"],
    permissions: {
        authentications: ["GET", "POST", "PUT", "DELETE"],
        users: ["DELETE"]
    },
    grants: {
        guest: ['GET_authentications', 'POST_authentications', 'PUT_authentications', 'DELETE_authentications'],
        DbManager: ['DELETE_users']
    }
}

describe("AuthizationRbac testing", () => {

    test("setup Authization Rbac", async () => {
        const authizationRbac = new AuthizationRbac(rbac_opts)

        try {
            await authizationRbac.init()
            expect(authizationRbac).toBeDefined()
        } catch (error) {
            expect(error).toBeNull()
        }

    });

    test("Authization Rbac can method testing", async () => {
        const authizationRbac = new AuthizationRbac(rbac_opts)

        await authizationRbac.init()

        const can = await authizationRbac.can(['guest'], 'GET', 'authentications')
        console.log(can)

        expect(can).toBeTruthy()
    });

    test("Authization Rbac canAll method testing", async () => {
        const authizationRbac = new AuthizationRbac(rbac_opts)

        await authizationRbac.init()

        const permissionsToCheck = [
            ["GET", "authentications"],
            ["POST", "authentications"]
        ]

        const canAll = await authizationRbac.canAll(['guest'], permissionsToCheck)

        expect(canAll).toBeTruthy()
    });

    test("Authization Rbac canAny method testing", async () => {
        const authizationRbac = new AuthizationRbac(rbac_opts)

        await authizationRbac.init()

        const permissionsToCheck = [
            ["GET", "authentications"],
            ["DELETE", "users"]
        ]

        const canAny = await authizationRbac.canAny(['guest'], permissionsToCheck)

        expect(canAny).toBeTruthy()

    });
});




