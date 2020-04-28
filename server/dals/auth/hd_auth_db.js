'use strict'

/*
module.exports = (dals) => {

    const db_user = dals.schemas.user;

    return {
        createUser: createUser,
        getUserByUsername: getUserByUsername,
        getUserById: getUserById,
        updateUser: updateUser,
        updateUserLastSignIn: updateUserLastSignIn,
    }

    function createUser(username, password_hash) {
        const query = {
            name: 'CreateUser',
            text:
                `INSERT INTO ${db_user.table} ` +
                `(${db_user.username}, ${db_user.password_hash}) ` +
                `VALUES ($1, $2) RETURNING *;`,
            values: [username, password_hash]
        }
        return dals.query(query)
            .then(res => res.rowCount ? res.rows.map(row => userInfo(row))[0] : undefined)
    }

    function getUserByUsername(username) {
        const query = {
            name: 'GetUserByUsername',
            text:
                `SELECT * FROM ${db_user.table} ` +
                `WHERE ${db_user.username} = $1;`,
            values: [username]
        };
        return dals.query(query)
            .then(res => res.rowCount ? res.rows.map(row => userInfo(row))[0] : undefined)
    }

    function getUserById(user_id) {
        const query = {
            name: 'GetUserById',
            text:
                `SELECT * FROM ${db_user.table} ` +
                `WHERE ${db_user.user_id} = $1;`,
            values: [user_id]
        };
        return dals.query(query)
            .then(res => res.rowCount ? res.rows.map(row => userInfo(row))[0] : undefined)
    }

    function updateUser(user) {
        const query = {
            name: 'UpdateUser',
            text:
                `UPDATE ${db_user.table} ` +
                `SET ${db_user.username} = $1, ${db_user.password_hash} = $2 ` +
                `${db_user.last_sign_in} = current_timestamp, ${db_user.is_active} = $3 ` +
                `WHERE ${db_user.user_id} = $4;`,
            values: [user.username, user.password_hash, user.is_active, user.id]
        };
        return dals.query(query)
            .then(res => res.rowCount ? res.rows.map(row => userInfo(row))[0] : undefined)
    }

    function updateUserLastSignIn(user) {
        const query = {
            name: 'UpdateUserLastSignIn',
            text:
                `UPDATE ${db_user.table} ` +
                `SET ${db_user.last_sign_in} = current_timestamp ` +
                `WHERE ${db_user.user_id} = $1;`,
            values: [user.id]
        };
        return dals.query(query)
            .then(res => res.rowCount > 0)
    }

    function userInfo(row) {
        return {
            id: row.user_id,
            username: row.username,
            password_hash: row.password_hash,
            created_at: new Date(row.created_at).toUTCString(),
            last_sign_in: row.last_sign_in ? new Date(row.last_sign_in).toUTCString() : null,
            is_active: row.is_active
        }
    }

}
*/
