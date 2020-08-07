const UserList = require('../sequelize-model').UserList,
    List = require('../sequelize-model').List,
    User = require('../sequelize-model').User,
    tryCatch = require('../../common/util/functions-utils')

module.exports = {
    getByUserId: (id) => tryCatch(() => UserList.findByPk(id)),

    //TODO: change fields from jointed query
    isUserBlackListed: (user_id) => tryCatch(() => User.findAll({where: {id: user_id}, include: [List], raw: true})),

    create: (listId, userId, updater, start_date, active) => tryCatch(() => UserList.create({
        ListId: listId,
        UserId: userId,
        start_date: start_date,
        active: active,
        updater: updater
    }, {include: [List]})),

    delete: (listId, userId) => tryCatch(() => UserList.destroy({where: {ListId: listId, UserId: userId}})),

    update: async (user, list, endDate, active) => tryCatch(() => UserList.update({
            end_date: endDate,
            active: active
        },
        {where: {UserId: user, ListId: list}}))
}
