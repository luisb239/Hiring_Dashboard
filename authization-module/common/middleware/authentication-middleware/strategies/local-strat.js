const LocalStrategy = require('passport-local').Strategy,
    {findCorrespondingUser, addNotification, isBlackListed} = require('../../../util/passport-utils'),
    Idp = require('../../../../resources/dals/idps-dal'),
    errors = require('../../../errors/app-errors'),
    {User} = require('../../../../resources/sequelize-model');

const localStratBuilder = () => new LocalStrategy(
    async function (username, password, done) {
        const user = await findCorrespondingUser(username)
        if (!user) {
            return done(null, false, {message: 'User isnt in database'});
        }
        if (await isBlackListed(user.id)) {
            addNotification(user.id);
            return done(errors.userIsBlacklisted, null);
        }
        if (await Idp.getByUserId(user.id)) {
            return done(errors.IdpUserUnauthorized, false);
        }
        if (await User.correctPassword(password, user)) {
            return done(null, user);
        }

        // incorrect password
        return done(errors.incorrectPassword, false);
    }
);

module.exports = localStratBuilder;
