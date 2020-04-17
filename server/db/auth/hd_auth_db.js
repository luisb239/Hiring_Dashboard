'use strict';

module.exports = (db) => {
    const user = db.entities.user;

    function user_info(row) {
        return {id: row.id, username: row.username, password_hash: row.password_hash}
    }

    return {
        createUser: createUser,
        getUserByUsername: getUserByUsername,
        getUserById: getUserById
    }

    function createUser(username, password_hash) {
        const values = [username, password_hash];
        return db.query(`INSERT INTO ${user.table}
        (${user.username}, ${user.password_hash}) VALUES ($1, $2) RETURNING ${user.id},${user.username}`, values)
            .then(res => res.rows)
    }

    function getUserByUsername(username) {
        const values = [username];
        return db.query(`SELECT ${user.id},${user.username},${user.password_hash} FROM ${user.table} WHERE ${user.username} = $1`, values)
            .then(res => res.rowCount === 0 ? undefined : res.rows)
    }

    function getUserById(user_id) {
        const values = [user_id];
        return db.query(`SELECT ${user.id},${user.username} FROM ${user.table} WHERE ${user.id} = $1`, values)
            .then(res => res.rowCount === 0 ? undefined : res.rows)
    }
}