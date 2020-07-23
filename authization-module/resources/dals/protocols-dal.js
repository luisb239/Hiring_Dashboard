const Protocols = require('../sequelize-model').Protocols,
    tryCatch = require('../../common/util/functions-utils')


module.exports = {
    create: (name, active) =>
        tryCatch(() =>
            Protocols.create({
                name: name,
                active: active
            })
        ),

    get: () =>
        tryCatch(() => Protocols.findAll({ raw: true }))
    ,
    getByName: (name) =>
        tryCatch(() => Protocols.findByPk(name, { raw: true })),

    getActive: () => tryCatch(() => Protocols.findAll({ where: { active: 1 } })),

    changeActive: (protocol, active) => tryCatch(() => Protocols.update({ active: active }, { where: { protocol: protocol } }))
}
