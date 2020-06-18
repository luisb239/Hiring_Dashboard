'use strict'

const
    config = require("../config/config"),
    { Sequelize } = require('sequelize')

// setup database connection with sequelize
const sequelize = new Sequelize(config.database_opts.database, config.database_opts.user, config.database_opts.password, {
    host: config.database_opts.host,
    dialect: config.database_opts.sgbd,
    query: {raw: true},
    logging: false
})

config.sequelize = sequelize


async function databasesetup(rbac_opts) {

    // defining the EA model
    const {User, List, Protocols, Role} = require('../../resources/sequelize-model')

    // sync present state of the database with our models
    await sequelize.sync()

    console.log('database setup correctly')


    await User.findOrCreate({where: {username: "superuser", password: "superuser"}})
    await List.findOrCreate({where: {"list": "BLACK"}})
    await List.findOrCreate({where: {"list": "GREY"}})
    await List.findOrCreate({where: {"list": "RED"}})
    await Protocols.findOrCreate({where: {"protocol": "Google", "active": true}})
    await Protocols.findOrCreate({where: {"protocol": "AzureAD", "active": true}})
    await Protocols.findOrCreate({where: {"protocol": "Saml", "active": true}})

    return require('../middleware/rbac')(rbac_opts)
}

module.exports = databasesetup
