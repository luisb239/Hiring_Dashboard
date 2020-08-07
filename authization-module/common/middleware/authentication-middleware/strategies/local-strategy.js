
const
    LocalStrategy = require('passport-local').Strategy,
    passportUtils = require('../../../util/passport-utils'),
    Idp = require('../../../../resources/dals/idps-dal'),
    errors = require('../../../errors/app-errors'),
    {User} = require('../../../../resources/sequelize-model');

module.exports = () => {

    return new LocalStrategy(
        async function (username, password, done) {
            const user = await passportUtils.findCorrespondingUser(username);

            const userIsFromIdp = await Idp.getByUserId(user.id)

            if (userIsFromIdp) {
                done(errors.IdpUserUnauthorized, false)
                return
            }

            if (!user) {
                done(null, false, {message: 'User isnt in database'});
                return
            }

            if (await passportUtils.isBlackListed(user.id)) {
                passportUtils.addNotification(user.id);
                done(null, false, {message: 'User is BlackListed'});
                return;
            }

            if (await User.correctPassword(password, user)) {
                done(null, user);
            }
        }
    );


}
