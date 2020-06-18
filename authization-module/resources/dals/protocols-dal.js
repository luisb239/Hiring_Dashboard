const Protocols = require('../sequelize-model').Protocols

module.exports = {
    create: async (name, active) =>
        Protocols.create({
            name: name,
            active: active
        }),
    getAll: async () =>
        Protocols.findAll({raw: true})
    ,
    get: async (name) => 
        Protocols.findByPk(name,{raw:true})
    ,
    getAllActive:async()=>Protocols.findAll({where:{active:1}}),
    changeActive:async(protocol,active)=>Protocols.update({active: active}, {where: {protocol: protocol}})
}
