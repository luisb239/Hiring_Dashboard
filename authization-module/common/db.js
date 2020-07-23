'use strict'

const
    config = require("./config/config"),
    { Sequelize } = require('sequelize'),
    chalk = require('chalk')


// setup database connection with sequelize
const sequelize = new Sequelize(config.database_opts.database, config.database_opts.user, config.database_opts.password, {
    host: config.database_opts.host,
    dialect: config.database_opts.sgbd,
    query: { raw: true },
    logging: false
})

config.sequelize = sequelize


async function databasesetup(rbac_opts) {

    console.log(chalk.blue('DATABASE SETUP'))

    // defining the EA model
    const { List, Protocols } = require('../resources/sequelize-model')

    // sync present state of the database with our models
    await sequelize.sync()
    
    // TODO: Events to check if end dates have already passed 
    // Set up default values for Lists and Available authentication identity providers
    const promiseArr = [
        List.findOrCreate({ where: { "list": "BLACK" } }),
        List.findOrCreate({ where: { "list": "GREY" } }),
        List.findOrCreate({ where: { "list": "RED" } }),
        Protocols.findOrCreate({ where: { "protocol": "Google" }, defaults: { "active": 1 } }),
        Protocols.findOrCreate({ where: { "protocol": "AzureAD" }, defaults: { "active": 1 } }),
        Protocols.findOrCreate({ where: { "protocol": "Auth0" }, defaults: { "active": 1 } }),
        require('./rbac')(rbac_opts)
    ]

    // using promise.all to maximize performance
    return Promise.all(promiseArr).then(_ => console.log(chalk.green('MODULE SET UP CORRECTLY')))

}

module.exports = databasesetup
