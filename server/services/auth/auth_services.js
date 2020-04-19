'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (db) => {

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

        return db.getUserByUsername(username)
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

        return db.getUserByUsername(username)
            .then(user => {
                if (user) return Promise.reject("Username already exists")
                return bcrypt.hash(password, saltRounds)
                    .then(hash => db.createUser(username, hash))
            })
    }

    function getUserById(userId) {
        if (!userId)
            return Promise.reject("User Id missing")

        return db.getUserById(userId)
            .then(user => user ? user : Promise.reject(`No user found with id : ${userId}`))
    }

    // Should we verify the 'user' argument properties?
    function logout(user) {
        return db.updateUserLastSignIn(user)
            .then(res => res)
    }

    // TODO - Typify service responses -> Routes will only accept the typified responses
    // Do the same thing for db?
}