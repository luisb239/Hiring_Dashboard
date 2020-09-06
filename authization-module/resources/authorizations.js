const userRolesDal = require('../resources/dals/users-roles-dal'),
    config = require('../common/config/config'),
    errors = require('../common/errors/app-errors');
const rbac = require('../common/rbac');

module.exports = {
    /**
     *
     * @param req
     * @param resp
     * @param next
     * @returns {Promise<*>}
     */
    check: async (req, resp, next) => {
        const resource = req.path.split('/')[2];
        const {method: action, user} = req;
        let roles = [];

        if (user) {
            roles = (await userRolesDal.getUserActiveRoles(user.id)).map(userRole => userRole['Role.role']);
            if (roles.includes('admin')) {
                return next();
            }
        } else {
            roles.push('guest');
        }

        for (const item of roles) {
            if (await config.rbac.can(item, action, resource)) {
                return next();
            }
        }

        return user ? next(errors.Unauthorized) : next(errors.Forbidden);
    },

    getUserPermissions: async (req, resp, next) => {
        const {user} = req;
        const permissions = [];
        let roles = [];

        if (user) {
            roles = (await userRolesDal.getUserActiveRoles(user.id)).map(userRole => userRole.role);
        }
        //TODO: try this instead: return Promise.all(roles.map(config.rbac.getScope));
        await Promise.all(roles.map(async role => permissions.push(await config.rbac.getScope(role))));
        return permissions.flat();
    },

    authorizationInfo: async req => {
        const roles = await userRolesDal.getUserActiveRoles(req.user.id);

        return req.body.permissions
            .map(({action, resource}) =>
                JSON.parse(`${resource}/${action}: ${roles.some(role => rbac.can(role.role, action, resource))}`));
    },

};
