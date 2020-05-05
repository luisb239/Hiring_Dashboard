'use strict'

/*
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (dals) => {

    return {
        authenticate: authenticate,
        getUserById: getUserById,
        logout: logout,
        createUser: createUser,
    }

    function authenticate(username, password) {
        // mudar para método
        if (!username)
            return Promise.reject("Username missing")
        if (!password)
            return Promise.reject("Password missing")

        return dals.getUserByUsername(username)
            .then(user => {
                if (!user) return Promise.reject("Username not existent")
                return bcrypt.compare(password, user.password_hash)
                    .then(match => match ? user : Promise.reject("Incorrect password"));
            });
    }

    function createUser(username, password) {
        if (!username)
            return Promise.reject("Username missing")
        if (!password)
            return Promise.reject("Password missing")

        return dals.getUserByUsername(username)
            .then(user => {
                if (user) return Promise.reject("Username already exists")
                return bcrypt.hash(password, saltRounds)
                    .then(hash => dals.createUser(username, hash))
            })
    }

    function getUserById(userId) {
        if (!userId)
            return Promise.reject("User Id missing")

        return dals.getUserById(userId)
            .then(user => user ? user : Promise.reject(`No user found with id : ${userId}`))
    }

    // Should we verify the 'user' argument properties?
    function logout(user) {
        return dals.updateUserLastSignIn(user)
            .then(res => res)
    }

}

 */
