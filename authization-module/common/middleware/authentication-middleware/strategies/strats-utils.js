const {checkProtocol, findUserByIdpOrCreate, addNotification, isBlackListed} = require('../../../util/passport-utils');
const errors = require('../../../errors/app-errors')

const strategyCallback = async (idpId, idpName, username, password, protocol, idp, done) => {
    let error = errors.protocolIsNotActive;
    if (await checkProtocol(protocol, idp)) {
        const user = await findUserByIdpOrCreate(idpId, idpName, username, password);
        if (!await isBlackListed(user.id)) {
            return done(null, user);
        }
        addNotification(user.id);
        error = errors.userIsBlacklisted;
    }
    return done(error, false);
};

module.exports = strategyCallback;
