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
        if (!username)
            return Promise.reject("Username missing")
        if (!password)
            return Promise.reject("Password missing")

        return db.getUserByUsername(username)
            .then(user => {
                if (!user) return Promise.reject("Username not existent")
                return bcrypt.compare(password, user.password)
                    .then(match => {
                        if (!match) return Promise.reject("Incorrect password")
                    });
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
                    .then(hash => {
                        return db.createUser(username, hash)
                    })
            })
    }

    function getUserById(userId) {

    }

    function logout(userId) {

    }
}