const {Sequelize, Op} = require('sequelize'),
    config = require('../common/config/config'),
    bcrypt = require('bcrypt');

//For testing purposes we need to generate a new Sequelize here if config doesnt already own one
const {database, dbms, host, password, user} = config.database_opts;
let dbInfo = {host, dialect: dbms, query: {raw: true}};
if (process.env.INSTANCE_CONNECTION_NAME) {
    dbInfo = {
        ...dbInfo,
        host: process.env.INSTANCE_CONNECTION_NAME,
        dialectOptions: {socketPath: process.env.INSTANCE_CONNECTION_NAME}
    };
}
const sequelize = config.sequelize || new Sequelize(database, user, password, dbInfo);

const {STRING, DATE, BOOLEAN, INTEGER, TEXT} = Sequelize;


/**
 * @param modelName
 * @param attributes
 * @param timestamps
 * @returns {Model}
 */
const defineTable = (modelName, attributes, timestamps) => sequelize.define(modelName, attributes, {
    timestamps,
    freezeTableName: true
});

/**
 * Permission(
 * - method: NonNullString,
 * - path: DefaultString,
 * - description: DefaultString)
 * @type {Model}
 */
const Permission = defineTable('Permission', {
    action: {type: STRING, validate: {notEmpty: true}, allowNull: false},
    resource: {type: STRING, validate: {notEmpty: true}, allowNull: false}
}, false);
/**
 * AuthenticationType(
 * - protocol: NonNullStringPK,
 * - active:DefaultBool)
 * @type {Model}
 */
const AuthenticationTypes = defineTable('AuthenticationTypes', {
    protocol: {type: STRING, primaryKey: true, validate: {notEmpty: true}, allowNull: false},
    idp: {type: STRING, primaryKey: true, validate: {notEmpty: true}, allowNull: false}, active: BOOLEAN
}, false);
/**
 Role(
 * - role: NonNullString,
 * - parent_role: DefaultInt)
 * @type {Model}
 */
const Role = defineTable('Role', {
    role: {type: STRING, validate: {notEmpty: true}, allowNull: false, unique: true},
    parent_role: INTEGER
}, false);
/**
 * RolePermission(
 * - role: NonNullAutoIncIntPK,
 * - permission: NonNullIntPK)
 * @type {Model}
 */
Role.belongsToMany(Permission, {through: 'RolePermission', timestamps: false}, false);
Permission.belongsToMany(Role, {through: 'RolePermission', timestamps: false}, false);

const RolePermission = defineTable('RolePermission', {}, false);
RolePermission.removeAttribute('id');

RolePermission.belongsTo(Role, {onDelete: 'CASCADE'});
Role.hasMany(RolePermission);

RolePermission.belongsTo(Permission, {onDelete: 'CASCADE'});
Permission.hasMany(RolePermission);

/**
 * User(
 * - username: NonNullString,
 * - password: DefaultString)
 * @type {Model}
 */
const User = defineTable('User', {
    username: {type: STRING, validate: {notEmpty: true}, allowNull: false, unique: true},
    password: {
        type: STRING, validate: {
            minLength(password) {
                if (password.length < 9) {
                    throw new Error('Password needs to have atleast 9 characters');
                }
                const idx = [/.*[a-z]/, /.*[A-Z]/, /\d/, /.*\W/].filter(requirement => password.match(requirement)).length;
                if (idx < 3) {
                    throw new Error('The Password must meet 3 of these requirements:Atleast One UpperCase letter,One LowerCase letter,one special char and one digit');
                }
            }
        }, get() {
            return () => this.getDataValue('password');
        }
    },
    updater: {type: INTEGER},
}, false);

User.belongsTo(User, {foreignKey: 'updater'});

User.encryptPassword = async (password) => await bcrypt.hash(password, await bcrypt.genSalt(10));

User.correctPassword = async (enteredPassword, user) => await bcrypt.compare(enteredPassword, user.password);

const setSaltHashAndPassword = async user => {
    if (user.changed('password')) {
        user.password = await User.encryptPassword(user.password());
    }
};

const updateSaltHashAndPassword = async user => {
    if (user.attributes.password) {
        user.attributes.password = await User.encryptPassword(user.attributes.password);
    }
};



User.beforeCreate(setSaltHashAndPassword);
User.beforeBulkUpdate(updateSaltHashAndPassword);

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
    updater: INTEGER,
    user_id: {type: INTEGER}
}, false);
//User.hasMany(UserHistory, { foreignKey: 'user_id' })
//UserHistory.belongsTo(User, { foreignKey: 'updater' })

/**
 * List(
 * - user_id: DefaultString,
 * - list: DefaultString)
 * @type {Model}
 *
 */
const List = defineTable('List', {
    list: {
        type: STRING,
        validate: {notEmpty: true},
        allowNull: false,
        unique: true
    }
}, false);

const UserAssociation = (associationName) => defineTable(associationName, {
    start_date: {type: DATE, allowNull: false},
    end_date: {
        type: DATE, validate: {
            isDateAndTimeAfter(end_date) {
                if (new Date(end_date) < new Date(this.start_date)) {
                    throw new Error('end_date needs to be after start_date');
                }
            }
        }
    },
    updater: {model: 'User', key: 'id', type: INTEGER, allowNull: false}, active: BOOLEAN,
}, false);

const UserList = UserAssociation('UserList');
List.belongsToMany(User, {through: UserList});
User.belongsToMany(List, {through: UserList});

UserList.belongsTo(User, {foreignKey: 'updater', onDelete: 'CASCADE'});
UserList.belongsTo(User);
User.hasMany(UserList);
UserList.belongsTo(List);
List.hasMany(UserList);

/**
 * Idp(
 * - user_id: NonNullIntPK,
 * - idp_id: DefaultString,
 * - idpname: DefaultString)
 * @type {Model}
 */
const Idp = defineTable('Idp', {idp_id: STRING(1234, false), idpname: STRING}, false);
User.hasOne(Idp, {foreignKey: 'user_id', onDelete: 'CASCADE'});
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

UserRoles.belongsTo(User, {foreignKey: 'updater', onDelete: 'CASCADE'});
UserRoles.belongsTo(User);
User.hasMany(UserRoles);

UserRoles.belongsTo(Role);
Role.hasMany(UserRoles);

const Session = defineTable('Sessions', {sid: {type: STRING(36), primaryKey: true}, expires: DATE, data: TEXT}, true);

User.hasMany(Session);
Session.belongsTo(User);


const createHistory = async (date, updater, description, UserId) => {
    UserHistory.create({date, updater, description, user_id: UserId});
};

const invalidateSessions = async userList => {
    const {ListId, UserId, start_date, updater} = userList.dataValues;
    console.log('correu hook 1');
    const list = await List.findOne({where: {id: ListId}});
    if (list.list === 'BLACK') {
        Session.destroy({where: {Userid: UserId}});
    }
    createHistory(start_date, updater, `The list with the id:${ListId} was added to the user`, UserId);
};


const createUserRoleHistory = async ({dataValues: {RoleId, UserId, start_date, updater}}) => {
    createHistory(start_date, updater, `The role with the id:${RoleId} was added to the user`, UserId);
};

const createUserHistory = async ({dataValues: {id, updater}}) => {
    createHistory(new Date(), updater, `The user was created`, id);
};

const deleteUserRoleHistory = async ({RoleId, UserId, start_date, updater}) => {
    createHistory(start_date, updater, `The role with the id:${RoleId} was deleted from the user`, UserId);
};

const deleteUserHistory = async ({id, updater}) => {
    createHistory(new Date(), updater, `The user was deleted`, id);
};


const deleteUserListHistory = async ({ListId, UserId, start_date, updater}) => {
    createHistory(start_date, updater, `The list with the id:${ListId} was removed from the user`, UserId);
};

const updateUserRoleHistory = async options => {
    const userRoles = await UserRoles.findAll({where: options.where});
    userRoles.map(userRole => createHistory(userRole.start_date, userRole.updater, `The association with the Role with the id:${userRole.RoleId} was updated`, userRole.UserId));
};


const updateUserHistory = async dataValues => {
    createHistory(new Date(), dataValues.attributes.updater, `The user was updated`, dataValues.where.id);
};


const updateUserListHistory = async options => {
    const userLists = await UserList.findAll({where: options.where});
    userLists.map(userList => createHistory(userList.start_date, userList.updater, `The association with the Role with the id:${userList.ListId} was updated`, userList.UserId));
};



UserList.afterCreate(invalidateSessions);
UserRoles.afterCreate(createUserRoleHistory);
User.afterCreate(createUserHistory);

UserList.afterDestroy(deleteUserListHistory);
UserRoles.afterDestroy(deleteUserRoleHistory);
User.afterDestroy(deleteUserHistory);

UserList.beforeBulkUpdate(updateUserListHistory);
UserRoles.beforeBulkUpdate(updateUserRoleHistory);
User.afterBulkUpdate(updateUserHistory);


const cron = require('node-cron');
cron.schedule('*/5 * * * *', async () => {
    console.log('running a task every 5 minute');
    await UserRoles.update({active: false}, {where: {end_date: {[Op.lt]: new Date()}, active: true}});
    await UserList.update({active: false}, {where: {end_date: {[Op.lt]: new Date()}, active: true}});
});




exports.Permission = Permission;
exports.AuthenticationTypes = AuthenticationTypes;
exports.Role = Role;
exports.RolePermission = sequelize.models.RolePermission;
exports.UserHistory = UserHistory;
exports.User = User;
exports.List = List;
exports.Idp = Idp;
exports.UserList = sequelize.models.UserList;
exports.UserRoles = UserRoles;
exports.Session = Session;
exports.Op = Op;
