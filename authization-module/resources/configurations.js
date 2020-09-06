const
    config = require('../common/config/config'),
    passport = require('passport');
const getIdpOptions = idpProp => Object.keys(config[idpProp]).filter(item => item !== 'callbackUrl');

// this module allows clients to change module configurations (database options, client ids and such)
module.exports = {

    /**
     * change google qauthentication options
     * @param newConfiguration
     */
    changeGoogleAuthenticationOptions: newConfiguration => {
        newConfiguration.callbackUrl = config.google_oauth2.callbackUrl;
        config.google_oauth2 = newConfiguration

        delete passport._strategies.google_oauth2;

        const strat = require('../common/middleware/authentication-middleware/strategies/google-strat')();

        passport.use('google', strat);
    },
    /**
     *
     * @param newConfiguration
     */
    changeAzureADAuthenticationOptions: newConfiguration => {
        newConfiguration.callbackUrl = config.office365_oauth2.callbackUrl;
        config.office365_oauth2 = newConfiguration;

        delete passport._strategies.office365_oauth2;

        const strat = require('../common/middleware/authentication-middleware/strategies/azure-strat')();

        passport.use('azure_ad_oauth2', strat);
    },

    changeSamlAuthenticationOptions: newConfiguration => {
        newConfiguration.callbackUrl = config.office365_saml.callbackUrl;
        config.office365_saml = newConfiguration;

        delete passport._strategies.office365_saml;

        const strat = require('../common/middleware/authentication-middleware/strategies/saml-strat')();

        passport.use('saml', strat);
    },

    getRbacOptions: async () => {

        const
            rolesDal = require('./dals/roles-dal'),
            permissionsDal = require('./dals/permissions-dal');

        const roles = (await rolesDal.get()).map(role => role.role);

        const permissions = await permissionsDal.get();
        const resources = [];

        // save unique resources on the array "resources"
        permissions.forEach(permission => !resources.includes(permission.resource) && resources.push(permission.resource));

        // map each permission to its resource and respective array of possible actions
        let formattedPermissions = {};
        resources
            .forEach(resource => formattedPermissions[resource] = permissions
                .filter(permission => permission.resource === resource)
                .map(permission => permission.action));

        let formattedGrants = {};

        await Promise.all(roles
            .map(async role => {
                var grant = await config.rbac.getScope(role);
                formattedGrants[role] = grant;
                return grant;
            }));

        return {roles, permissions: formattedPermissions, grants: formattedGrants};
    },

    getGoogleOptions: async () => getIdpOptions('google_oauth2'),

    getAzureAdOptions: async () => getIdpOptions('office365_oauth2'),

    getSamlOptions: async () => getIdpOptions('office365_saml'),

};
