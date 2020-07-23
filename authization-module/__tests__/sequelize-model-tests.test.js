'use strict';






//const {user,role} = authi.getFunctionalities()


//const {User,Idp,List,Permission,Protocols,Role,UserHistory} =require('../resources/sequelize-model');
//const userDal = require('../resources/dals/users-dal');
//const roleDal = require('../resources/dals/roles-dal');

const containsSubObject = (jsonObject,subObject) => {
    console.log(`Searching for ${JSON.stringify(subObject).toString()} in ${JSON.stringify(jsonObject).toString()}`);
    return Object.keys(subObject)
        .map(key=>jsonObject[key]===subObject[key])
        .reduce((prev, curr) => prev && curr)
}

const basicCheckByJson = (json,model) => model
        .create(json)
        .then(data=>model.findAll({raw: true}))
        .then(data=>data.filter(obj=>containsSubObject(obj,json)))
        .then(data=>expect(data.length>0).toBeTruthy())
        .then(data=>model.destroy({where: json}))
        .then(data=>model.findAll({raw: true}))
        .then(data=>data.filter(obj=>containsSubObject(obj,json)))
        .then(data=>expect(data.length===0).toBeTruthy());

const basicCheckById = (json,model) => {
    var id;
    return model
        .create(json)
        .then(d=>{id=d.dataValues.id})
        .then(data=>model.findAll({raw: true}))
        .then(data=>data.filter(obj=>obj.id===id))
        .then(data=>expect(data.length>0).toBeTruthy())
        .then(data=>model.destroy({where: json}))
        .then(data=>model.findAll({raw: true}))
        .then(data=>data.filter(obj=>obj.id===id))
        .then(data=>expect(data.length===0).toBeTruthy())};


//if something is not working dont forget to add environment variable in your system or in your IDE: NODE_ENV=testing
//if running test alone make sure to add await in the end of test, running all tests will make them run in parallel
describe("Sequelize Testings", () => {
    test('Module Setup',async ()=>{
        //const express=require('express');
        const authi = require('../authization');
        await authi.setup()
        authi.getFunctionalities()
    })

    test('Test UserDal without IDPs methods',async ()=>{
        const authi = require('../authization');
        const user = (await authi.setup()).user
        const newPass = 'newPass',newName='newUsername';
        //Create and check
        const created = await user.create('usernameTest','passwordTest').then(data=>data.dataValues);
        await user.getAll().then(users=>expect(users).toContainEqual(created));
        //Update and check
        await user.updatePassword(newPass,created.id);
        await user.getByUsername(created.username).then(data=>expect(data.password).toEqual(newPass));
        await user.updateUsername(newName,created.id);
        await user.getById(created.id).then(d=>expect(d.username).toEqual(newName));
        //Delete and check
        await user.delete(created.id);
        await user.get(newName,newPass).then(data=>expect(data).toBeNull());
        await user.getById(created.id).then(data=>expect(data).toBeNull());
    })

    test('Test RoleDal methods',async ()=>{
        const newParent = 'admin',newName='newRleTest';
        //Create and check
        const created = await roleDal.create(newName).then(data=>data.dataValues);
        await roleDal.getAll().then(users=>expect(users).toContainEqual(created));
        console.log('created: ', created)
        //Update and check
        const parent = await roleDal.addParentRole(newParent)
        console.log('parent: ',parent)
        //await roleDal.update()
        //await userDal.updatePassword(newPass,created.id);
       //await userDal.getByUsername(created.username).then(data=>expect(data.password).toEqual(newPass));
       //await userDal.updateUsername(newName,created.id);
       //await userDal.getById(created.id).then(d=>expect(d.username).toEqual(newName));
        //Delete and check
      // await userDal.delete(created.id);
      // await userDal.get(newName,newPass).then(data=>expect(data).toBeNull());
      // await userDal.getById(created.id).then(data=>expect(data).toBeNull());
    })

    test("Check creation, obtaining and elimination of Idp", async () => {
        const idp = {idp_id: 'test_idp_id', idpname: 'auth0_testing',user_id:1}
        basicCheckByJson(idp,Idp)
    });
    //needs to be by id cause date comes in diferent format on output
    test("Check creation, obtaining and elimination of List", async () => {
        const list = {list: 'testList',
            start_date: '2020-04-9 02:55:05',
            end_date:  '2020-06-9 02:55:05',
            updater: 10,
            active: true}
        basicCheckById(list,List)
    });

    test("Check creation, obtaining and elimination of Permission", async () => {
        const perm = { path: '/test/permission',
            method: 'TEST',
            description: 'testDesc'}
        basicCheckByJson(perm,Permission)
    });

    test("Check creation, obtaining and elimination of Protocols", async () => {
        const proto = {protocol: 'testProtocol', active: 1}
        basicCheckByJson(proto,Protocols)
    });

    test("Check creation, obtaining and elimination of Role", () => {
        const role = { role: 'monkeyTester', parent_role: null} //monkeyTester doest have parent he is supreme god
        basicCheckByJson(role,Role)
    });
    test("Check creation, obtaining and elimination of User History", () => {
        const usrHistory = { date: '2020-04-9 02:55:05', description: "user history created test",user_id:1}
        basicCheckById(usrHistory,UserHistory)
    });

    test("Check creation, obtaining and elimination of User ", async () => {
        const user = {username: 'usernameTest',password: 'passwordTest'}
        await basicCheckByJson(user,User)
    });

    test("Check join User with Role ", async () => {
         await User.findAll({ where: { id:1}, include: [Role],raw:true}).then(data=>console.log(data))
    });

    test("Check join User with List ", async () => {
        await User.findAll({where:{id:1},include:[List],raw:true}).then(data=>console.log(data))
    });

    test("Check join Permission with Roles ", async () => {
        await Role.findAll({where:{id:1},include:[Permission],raw:true}).then(data=>console.log(data))
    });
});




