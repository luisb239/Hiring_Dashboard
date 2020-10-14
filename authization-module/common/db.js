const
    config = require('./config/config'),
    {Sequelize} = require('sequelize'),
    chalk = require('chalk');


// setup database connection with sequelize
const {database, dbms, host, password, user} = config.database_opts;
let dbInfo = {host, dialect: dbms, query: {raw: true}, logging: false};
if (process.env.INSTANCE_CONNECTION_NAME) {
    dbInfo = {
        ...dbInfo,
        host: process.env.INSTANCE_CONNECTION_NAME,
        dialectOptions: {
            socketPath: process.env.INSTANCE_CONNECTION_NAME
        }
    };
}
const sequelize = new Sequelize(database, user, password, dbInfo);

config.sequelize = sequelize;

const databasesetup = async rbacOpts => {

    console.log(chalk.blue('DATABASE SETUP'));

    // defining the EA model
    const {List, AuthenticationTypes} = require('../resources/sequelize-model');

    // sync present state of the database with our models
    await sequelize.sync();

    // Set up default values for Lists and Available authentication identity providers
    const promiseArr = [
        List.findOrCreate({where: {'list': 'BLACK'}}),
        AuthenticationTypes.upsert({
            "active": !!config.google_oauth2.callbackUrl,
            "idp": "google",
            "protocol": "oauth2"
        }),

        AuthenticationTypes.upsert({
            "active": !!config.office365_oauth2.callbackUrl,
            "protocol": "oauth2",
            "idp": "office365"
        }),

        AuthenticationTypes.upsert({
            "active": !!config.office365_saml.callbackUrl,
            "protocol": "saml",
            "idp": "office365"
        }),
        require('./rbac')(rbacOpts),
    ]


    // using promise.all to maximize performance
    return Promise.all(promiseArr).then(_ => console.log(chalk.green('MODULE SET UP CORRECTLY')));

};

module.exports = databasesetup;
