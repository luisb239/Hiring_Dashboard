# Authization
Authization is a Passport based module, built to handle authentication and authorization by you in your express app.

***Auth***entication + Author**ization** = **Authization**
Currently we support OpenId and SAML protocols with Idps from Azure(Office 365) and Google.
Authization builds you a User management model based on the RBAC method that allows you to:
 - Creation, deletion and editing user’s username and password;  
 - Management of roles;  
 - Management of permissions;   
 - Binding permissions to roles.;  
 - Association of users to roles;  
 - Blacklist management;  
 - Storage of user’s history;  
 - Management of user sessions.
[Check out our Documentation for more information on available methods!](https://dleandro.github.io/authentication-authorization-project-integration/)
## Using our module
* Step 1: Clone the repo to your desired folder;
* Step 2: Run ```$ npm i @authization/authization --save``` on the root folder of your project;
* Step 3: On your express app initialization insert the following line to setup our module. This require line also returns the module's functions. Make sure you insert the express app as a parameter to setup the module.
  ```js 
  const dbConfigs = {
    "host":'?????????',
    "port":3306,
    "user":'????',
    "password":'?????',
    "connectionLimit": 5,
    "database":'?????',
    "dbms": '??????'
  }
  var mod = await require('@authization/authization').setup({app,db:dbConfigs});
  ```
  
* Step 4: Once you have the module set up you may call any of the dals ``` const localLoginMiddleware =  mod.authenticate.usingLocal```.
# Usage examples
User creation:
```js
const users = require('../../authization-module/authization').user
users.create(req.body.username, req.body.password)
```
User authentication:
```js
const authentication = mod.authenticate
  authenticationRouter.post(
    '/local',
    authentication.usingLocal,
    (req, res) => {
      setResponse(res, { success: "login successful" }, 200)
    }
  
   authenticationRouter.post(
    '/google',
    authentication.usingGoogle,
    (req, res) => {
      setResponse(res, { success: "login successful" }, 200)
    }
    
    authenticationRouter.post(
    '/google',
    authentication.usingOffice365,
    (req, res) => {
      setResponse(res, { success: "login successful" }, 200)
    }
  )
 ```
Note that authentication and authorization functions need to be used as middleware because they require request, response and next parameters. All the other functions can be used wherever
 
More documentation on the specific methods and their requirements will be available on this repo's wiki
List creation:
```js
const lists = mod.list
lists.create(req.body.user_id, req.body.list, req.body.start_date, req.body.end_date, req.body.updater, req.body.active)
```
Permission creation:
```js
const permissions = mod.permission
permissions.create('POST', '/newList', 'gives a user permission to create new Lists')
```
Role creation:
```js
const roles = mod.role
roles.create(req.body.role)
```
User Role assignment:
```js
const userRoles = mod.userRole
userRoles.create(req.body.user, req.body.role, req.body.start_date, req.body.end_date, req.body.updater, req.body.active)
```
Role Permission creation:
```js
const rolePermission = mod.rolePermission
rolePermission.create(req.body.role, req.body.permission)
```
User History consultation:
```js
const userHistory = mod.userHistory
userHistory.getAll()
```
[Read our Documentation!](https://github.com/dleandro/Authentication-and-Authorization-Node-Component-/blob/master/authization-module/reports%26docs/dals-documentation/docs/index.html)
