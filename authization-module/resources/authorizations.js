'use strict'

const rolesDal = require('./dals/roles-dal')
const usersDal = require('./dals/users-dal')

const userRoleDal = require('../resources/dals/users-roles-dal'),
    SUPER_USER = 'superuser',
    config=require('../common/config/config')

module.exports = {
    /**
     *
     * @param req
     * @param resp
     * @param next
     * @returns {Promise<*>}
     */
    check: async (req, resp, next) => {
        const resource = req.path.split("/")[2]
        const action = req.method

        const user = req.user
        var roles = []
        if(user){
            roles= await usersDal.getUserRoles(user.id)
            roles=roles.map(role=>role["Roles.role"])
        }
            roles.push("guest")

        for(let i=0;i<roles.length;i++){
            if(await config.rbac.can(roles[i],action,resource)){
                return next()
            }
        }
        return next("User doesn't have permissions")
    }

}
