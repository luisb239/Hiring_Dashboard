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

const RolePermission = defineTable('RolePermission', { },false)
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
    username: { type: STRING, allowNull: false, unique: true },
    password: { type: STRING, get() { return () => this.getDataValue('password') } }
}, false);

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
const UserHistory = defineTable('User_History', { date: { type: DATE, allowNull: false }, description: STRING }, false);
User.hasMany(UserHistory, { foreignKey: 'user_id' })

/**
 * List(
 * - user_id: DefaultString,
 * - list: DefaultString)
 * @type {Model}
 */
const List = defineTable('List', { list: { type: STRING, allowNull: false, unique: true } }, false);

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
Role.belongsToMany(User, { through: UserRoles});
User.belongsToMany(Role, { through: UserRoles});

UserRoles.belongsTo(User, { foreignKey: 'updater' })
UserRoles.belongsTo(User)
User.hasMany(UserRoles)

UserRoles.belongsTo(Role)
Role.hasMany(UserRoles)

const Session = defineTable('Sessions', { sid: { type: STRING(36), primaryKey: true }, expires: DATE, data: TEXT }, true)

User.hasMany(Session)
Session.belongsTo(User)

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