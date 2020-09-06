const {User, Idp, List, Permission, Protocols, Role, UserHistory} = require('../resources/sequelize-model');
const userRoleDal = require('../resources/dals/users-roles-dal')
const userDal = require('../resources/dals/users-dal');
const roleDal = require('../resources/dals/roles-dal');
const listDal = require('../resources/dals/lists-dal');
const permDal = require('../resources/dals/permissions-dal');
const userListDal = require('../resources/dals/user-list-dal');

//if something is not working dont forget to add environment variable in your system or in your IDE: NODE_ENV=testing
//if running test alone make sure to add await in the end of test, running all tests will make them run in parallel
describe("Sequelize Testings", () => {

    test("Check bulk creation of UserRoles", async () => {

        //TODO: not working cause constraints
        const usersToAdd = [...Array(30).keys()].map(idx => ({
            UserId: idx + 13,
            RoleId: 1,
            start_date: new Date('2020-09-03 16:58:59'),
            end_date: null,
            updater: 1,
            active: 1,
            username: `bulkTestUser${idx}`,
            password: 'test',
            updater: 1
        }));
        await userRoleDal.get().then(console.log);
        await userRoleDal.createMultiple(usersToAdd);
        await userRoleDal.get().then(console.log);
    });
    test("Check bulk creation of Users", async () => {

        const usersToAdd = [...Array(50).keys()].map(idx => ({
            username: `bulkTestUser${idx}`,
            password: 'test',
            updater: 1
        }));
        await userDal.get().then(console.log);
        await userDal.createMultiple(usersToAdd);
        await userDal.get().then(console.log);
    });

    test("Check bulk creation of UserList", async () => {

        const permsToAdd = [...Array(30).keys()].map(idx => ({
            ListId: idx + 4,
            UserId: 1,
            updater: 1,
            start_date: new Date('2020-09-03 16:58:59'),
            end_date: null,
            active: 1
        }));
        await userListDal.getByUser(1).then(console.log);
        await userListDal.createMultiple(permsToAdd);
        await userListDal.getByUser(1).then(console.log);
    });
    test("Check bulk creation of Permission", async () => {

        const permsToAdd = [...Array(50).keys()].map(idx => ({action: 'GET', resource: `testperm${idx}`}));
        await permDal.get().then(console.log)
        await permDal.createMultiple(permsToAdd)
        await permDal.get().then(console.log)
    });
    test("Check bulk creation of List", async () => {

        const listToAdd = [...Array(50).keys()].map(idx => ({list: `testList${idx}`}));
        await listDal.get().then(console.log)
        //await listDal.createMultiple(listToAdd)
        await listDal.get().then(console.log)
    });

    test("Check creation, obtaining and elimination of Role", async () => {

        const rolesToAdd = [...Array(50).keys()].map(idx => ({role: `testRolev2${idx}`, parent_role: 1}));
        await Role.findAll().then(console.log)
        await Role.bulkCreate(rolesToAdd).then(inserted => console.log('inserted', inserted)).then(nothing => Role.get().then(roles => console.log('get ret:', roles)))
        await Role.findAll().then(console.log)

    });
    test("Check creation, obtaining and elimination of User History", () => {
        const usrHistory = {date: '2020-04-9 02:55:05', description: "user history created test", user_id: 1}
        basicCheckById(usrHistory, UserHistory)
    });

    test("Check creation, obtaining and elimination of User ", async () => {
        const user = {username: 'usernameTest', password: 'passwordTest'}
        await basicCheckByJson(user, User)
    });

    test("Check join User with Role ", async () => {
        await User.findAll({where: {id: 1}, include: [Role], raw: true}).then(data => console.log(data))
    });

    test("Check join User with List ", async () => {
        await User.findAll({where: {id: 1}, include: [List], raw: true}).then(data => console.log(data))
    });

    test("Check join Permission with Roles ", async () => {
        await Role.findAll({where: {id: 1}, include: [Permission], raw: true}).then(data => console.log(data))
    });
});




