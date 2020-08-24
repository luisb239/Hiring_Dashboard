const { Sequelize, DataTypes } = require('sequelize'),
    config = require('../common/config/config'),
    sequelize = config.sequelize,
    bcrypt = require('bcrypt')

const { STRING, DATE, BOOLEAN, INTEGER, TEXT } = Sequelize

/**
 * @param modelName
 * @param attributes
 * @returns {Model}
 */
const defineTable = (modelName, attributes, timestamps) => sequelize.define(modelName, attributes, { timestamps: timestamps, freezeTableName: true });

/**
 * Permission(
 * - method: NonNullString,
 * - path: DefaultString,
 * - description: DefaultString)
 * @type {Model}
 */
const Permission = defineTable('Permission', { action: { type: STRING, allowNull: false }, resource: { type: STRING, allowNull: false } }, false);
/**
 * Protocols(
 * - protocol: NonNullStringPK,
 * - active:DefaultBool)
 * @type {Model}
 */
const Protocols = defineTable('Protocols', { protocol: { type: STRING, allowNull: false, primaryKey: true }, active: BOOLEAN }, false);
/**
 Role(
 * - role: NonNullString,
 * - parent_role: DefaultInt)
 * @type {Model}
 */
const Role = defineTable('Role', { role: { type: STRING, allowNull: false, unique: true }, parent_role: INTEGER }, false);
/**
 * RolePermission(
 * - role: NonNullAutoIncIntPK,
 * - permission: NonNullIntPK)
 * @type {Model}
 */
Role.belongsToMany(Permission, { through: 'RolePermission', timestamps: false }, false);
Permission.belongsToMany(Role, { through: 'RolePermission', timestamps: false }, false);

const RolePermission = defineTable('RolePermission', {}, false)
RolePermission.removeAttribute('id');

RolePermission.belongsTo(Role)
Role.hasMany(RolePermission)

RolePermission.belongsTo(Permission)
Permission.hasMany(RolePermission)

/**
 * User(
 * - username: NonNullString,
 * - password: DefaultString)
 * @type {Model}
 */
const User = defineTable('User', {
    username: {type: STRING, allowNull: false, unique: true},
    password: {
        type: STRING, get() {
            return () => this.getDataValue('password')
        }
    },
    updater: {type: INTEGER}
}, false);

User.belongsTo(User, {foreignKey: 'updater'})

User.encryptPassword = async (password) => await bcrypt.hash(password, await bcrypt.genSalt(10))

User.correctPassword = async (enteredPassword, user) => await bcrypt.compare(enteredPassword, user.password)

const setSaltHashAndPassword = async user => {
    if (user.changed('password')) {
        user.password = await User.encryptPassword(user.password())
    }
}


User.beforeCreate(setSaltHashAndPassword)
User.beforeUpdate(setSaltHashAndPassword)

/**
 * User_History(
 * - user_id: NonNullAutoIncIntPK,
 * - date: NonNullDate,
 * - description: DefaultString)
 * @type {Model}
 */
const UserHistory = defineTable('User_History', {
    date: {type: DATE, allowNull: false},
    description: STRING,
    updater: INTEGER
}, false);
User.hasMany(UserHistory, {foreignKey: 'user_id'})
UserHistory.belongsTo(User, {foreignKey: 'updater'})

/**
 * List(
 * - user_id: DefaultString,
 * - list: DefaultString)
 * @type {Model}
 */
const List = defineTable('List', {list: {type: STRING, allowNull: false, unique: true}}, false);

const UserAssociation = (associationName) => defineTable(associationName, {
    start_date: { type: DATE, allowNull: false }, end_date: DATE,
    updater: { model: 'User', key: 'id', type: INTEGER, allowNull: false }, active: BOOLEAN
}, false);

const UserList = UserAssociation('UserList');
List.belongsToMany(User, { through: UserList });
User.belongsToMany(List, { through: UserList });

UserList.belongsTo(User, { foreignKey: 'updater' })
UserList.belongsTo(User)
User.hasMany(UserList)

UserList.belongsTo(List)
List.hasMany(UserList)

/**
 * Idp(
 * - user_id: NonNullIntPK,
 * - idp_id: DefaultString,
 * - idpname: DefaultString)
 * @type {Model}
 */
const Idp = defineTable('Idp', { idp_id: STRING(1234, false), idpname: STRING }, false);
User.hasOne(Idp, { foreignKey: 'user_id' })
/**
 * UserRoles(
 * - user_id: DefaultInt,
 * - role_id: DefaultInt,
 * - start_date: DefaultDate,
 * - end_date: DefaultDate,
 * - updater: DefaultInt,
 * - active: DefaultBool)
 * @type {Model}
 */

const UserRoles = UserAssociation('UserRoles');
Role.belongsToMany(User, {through: UserRoles});
User.belongsToMany(Role, {through: UserRoles});

UserRoles.belongsTo(User, {foreignKey: 'updater'})
UserRoles.belongsTo(User)
User.hasMany(UserRoles)

UserRoles.belongsTo(Role)
Role.hasMany(UserRoles)

const Session = defineTable('Sessions', {sid: {type: STRING(36), primaryKey: true}, expires: DATE, data: TEXT}, true)

User.hasMany(Session)
Session.belongsTo(User)

const createHistory = async (obj, description) => {

    UserHistory.create({date: obj.date, updater: obj.updater, description: description, user_id: obj.UserId})
}

const invalidateSessions = async (userList) => {
    userList = userList.dataValues
    console.log('correu hook 1')
    const list = await List.findOne({where: {id: userList.ListId}})
    if (list.list === 'BLACK') {
        Session.destroy({where: {Userid: userList.UserId}})
    }
    createHistory(userList, `The list with the id:${userList.ListId} was added to the user`)
}


const createUserRoleHistory = async ({dataValues}) => {
    createHistory(dataValues.start_date, dataValues.updater, `The role with the id:${dataValues.RoleId} was added to the user`, dataValues.UserId)
}

const createUserHistory = async ({dataValues}) => {
    createHistory(new Date(), dataValues.updater, `The user was created`)
}

const deleteUserRoleHistory = async ({dataValues}) => {
    createHistory(dataValues.start_date, dataValues.updater, `The role with the id:${dataValues.RoleId} was deleted from the user`, dataValues.UserId)
}

const deleteUserHistory = async ({dataValues}) => {
    createHistory(new Date(), dataValues.updater, `The user was deleted`)
}


const deleteUserListHistory = async ({dataValues}) => {
    createHistory(dataValues.start_date, dataValues.updater, `The list with the id:${dataValues.ListId} was removed from the user`, dataValues.UserId)
}

const updateUserRoleHistory = async ({dataValues}) => {
    createHistory(dataValues.start_date, dataValues.updater, `The association with the Role with the id:${dataValues.RoleId} was updated`, dataValues.UserId)
}

const updateUserHistory = async ({dataValues}) => {
    createHistory(new Date(), dataValues.updater, `The user was updated`)
}


const updateUserListHistory = async ({dataValues}) => {
    createHistory(dataValues.start_date, dataValues.updater, `The association with the list with the id:${dataValues.ListId} was updated`, dataValues.UserId)
}


UserList.afterCreate(invalidateSessions)
UserRoles.afterCreate(createUserRoleHistory)
User.afterCreate(createUserHistory)

UserList.afterDestroy(deleteUserListHistory)
UserRoles.afterDestroy(deleteUserRoleHistory)
User.afterDestroy(deleteUserHistory)

UserList.afterUpdate(updateUserListHistory)
UserRoles.afterUpdate(updateUserRoleHistory)
User.afterUpdate(updateUserHistory)


exports.Permission = Permission
exports.Protocols = Protocols
exports.Role = Role
exports.RolePermission = sequelize.models.RolePermission
exports.UserHistory = UserHistory
exports.User = User
exports.List = List
exports.Idp = Idp
exports.UserList = sequelize.models.UserList
exports.UserRoles = UserRoles
exports.Session = Session
