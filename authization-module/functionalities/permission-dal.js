'use strict'


const dalUtils = require('../common/util/dal-utils')

module.exports = {
    /**
     *
     * @param method
     * @param path
     * @param description
     * @returns {Promise<void>}
     */
    create: async (method, path, description) => dalUtils
        .executeQuery({
            statement: config.sgbd == 'mysql' ? 
            `INSERT INTO Permission(method,path,description) VALUES (?,?,?);` :
            `INSERT INTO Permission(method,path,description) VALUES ($1,$2,$3) RETURNING id;`,
            description: "adding permission",
            params: [method, path, description]
        }).then(async result => {
            return config.sgbd == 'mysql' ? result : { insertId: result.rows[0].id }
        }),

    /**
     *
     * @param method
     * @param path
     * @returns {Promise<void>}
     */
    delete: async (method, path) => dalUtils
        .executeQuery({
            statement: `DELETE FROM Permission WHERE id=?`,
            description: "deleting permission",
            params: [method, path]
        }),
    /**
     *
     * @returns {Promise<void>}
     */
    getAll: async () => dalUtils
        .executeQuery({
            statement: `Select * from Permission`,
            description: "getting all permissions",
            params: []
        }),
    /**
     *
     * @param id
     * @returns {Promise<void>}
     */
    getSpecificById: async (id) => dalUtils
        .executeQuery({
            statement: `Select * from Permission where id=?`,
            description: "get permission by id",
            params: [id]
        }),
    /**
     *
     * @param method
     * @param path
     * @returns {Promise<*>}
     */
    getSpecific: async (method, path) => dalUtils
        .executeQuery(
            {
                statement: `Select * from Permission where method=? and path=?`,
                description: "get permission by id",
                params: [method, path]
            })
        .then(result => result.length === 0 ? null : {
            id: result[0].id,
            method: result[0].method,
            path: result[0].path
        }),

}
