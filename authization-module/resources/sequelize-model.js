const { Sequelize, DataTypes } = require('sequelize'),
    config = require('../common/config/config'),
    sequelize = config.sequelize

const { STRING, DATE, BOOLEAN, INTEGER,TEXT } = Sequelize
const NonNullDate = { type: DATE, allowNull: false } //only used 1 time considering remove this const
const NonNullString = { type: STRING, allowNull: false }
const NonNullUniqueString = { ...NonNullString, unique: true } //only used 1 time considering remove this const
const NonNullStringPK = { ...NonNullString, primaryKey: true } //only used 1 time considering remove this const

/**
 * @param modelName
 * @param attributes
 * @returns {Model}
 */
const defineTable = (modelName, attributes) => sequelize.define(modelName, attributes, { timestamps: false, freezeTableName: true });

/**
 * Permission(
 * - method: NonNullString,
 * - path: DefaultString,
 * - description: DefaultString)
 * @type {Model}
 */
const Permission = defineTable('Permission', { action: STRING, resource: STRING });
/**
 * Protocols(
 * - protocol: NonNullStringPK,
 * - active:DefaultBool)
 * @type {Model}
 */
const Protocols = defineTable('Protocols', { protocol: NonNullStringPK, active: BOOLEAN });
/**
 Role(
 * - role: NonNullString,
 * - parent_role: DefaultInt)
 * @type {Model}
 */
const Role = defineTable('Role', { role: NonNullUniqueString, parent_role: INTEGER });
/**
 * RolePermission(
 * - role: NonNullAutoIncIntPK,
 * - permission: NonNullIntPK)
 * @type {Model}
 */
Role.belongsToMany(Permission, { through: 'RolePermission', timestamps: false });
Permission.belongsToMany(Role, { through: 'RolePermission', timestamps: false });
/**
 * User(
 * - username: NonNullString,
 * - password: DefaultString)
 * @type {Model}
 */
const User = defineTable('User', { username: { type: STRING, allowNull: false, unique: true }, password: STRING });
/**
 * User_History(
 * - user_id: NonNullAutoIncIntPK,
 * - date: NonNullDate,
 * - description: DefaultString)
 * @type {Model}
 */
const UserHistory = defineTable('User_History', { date: NonNullDate, description: STRING });
User.hasMany(UserHistory, { foreignKey: 'user_id' })
/**
 * UserSession(
 * - user_id: NonNullAutoIncIntPK,
 * - session_id: NonNullStringPK)
 * @type {Model}
 */
const UserSession = defineTable('User_Session', { session_id: { type: STRING, allowNull: false, primaryKey: true, } });
User.hasMany(UserSession, { foreignKey: 'user_id' })

/**
 * List(
 * - user_id: DefaultString,
 * - list: DefaultString)
 * @type {Model}
 */
const List = defineTable('List', {list: {type: STRING, unique: true}});


const UserAssociation = (associationName) => defineTable(associationName, { start_date: DATE, end_date: DATE, updater: INTEGER, active: BOOLEAN });

const UserList = UserAssociation('UserList');
List.belongsToMany(User, { through: UserList });
User.belongsToMany(List, { through: UserList });
/**
 * Idp(
 * - user_id: NonNullIntPK,
 * - idp_id: DefaultString,
 * - idpname: DefaultString)
 * @type {Model}
 */
const Idp = defineTable('Idp', { idp_id: STRING(1234,false), idpname: STRING });
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
Role.belongsToMany(User, { through: UserRoles });
User.belongsToMany(Role, { through: UserRoles });


exports.Permission = Permission
exports.Protocols = Protocols
exports.Role = Role
exports.RolePermission = sequelize.models.RolePermission
exports.UserHistory = UserHistory
exports.User = User
exports.UserSession = UserSession
exports.List = List
exports.Idp = Idp
exports.UserList = sequelize.models.UserList
exports.UserRoles = UserRoles
