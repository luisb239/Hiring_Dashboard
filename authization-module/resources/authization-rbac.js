const {RBAC} = require('rbac');

module.exports = class AuthizationRbac {

    constructor(rbac_opts) {
        this.rbac_opts = rbac_opts;
    }

    init() {
        this.rbac = new RBAC(this.rbac_opts);

        const {grants, permissions, roles} = this.rbac.options;
        if (Array.isArray(roles) && typeof (permissions) === 'object' && typeof (grants) === 'object') {
            return this.rbac.init();
        }
        throw Error('rbac options sent to the constructor were invalid');
    }

    can(rolesNames, action, resource) {
        return rolesNames.some(role => this.rbac.can(role, action, resource));
    }

    canAll(rolesNames, permissions) {
        return rolesNames.some(role => this.rbac.canAll(role, permissions));
    }

    canAny(rolesNames, permissions) {
        return rolesNames.some(role => this.rbac.canAny(role, permissions));
    }
};
