module.exports = function () {
    const AzureAdOAuth2Strategy = require('passport-azure-ad-oauth2').Strategy,
        azureAD = require('../../../config/config').office365_oauth2,
        jwt = require('jsonwebtoken'),
        strategyCallback = require('./strats-utils');

    return new AzureAdOAuth2Strategy({
            clientID: azureAD.azure_client_id,
            clientSecret: azureAD.azure_client_secret,
            callbackURL: azureAD.callbackUrl,
            tenant: azureAD.tenant
        },
        (accessToken, refreshToken, params, profile, done) => strategyCallback(params.id_token, 'azureAD', jwt.decode(params.id_token).email, 'EasterEgg123', 'oauth2', 'office365', done));

}
