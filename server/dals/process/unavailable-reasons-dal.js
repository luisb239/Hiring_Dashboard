'use strict'

const schema = require('../dal-schemas/process/unavailable-reasons-schema.js')

module.exports = (query) => {

    return {
        getAllUnavailableReasons
    }


    async function getAllUnavailableReasons() {
        const statement = {
            name: 'Get All Unavailable Reasons',
            text:
                `SELECT * FROM ${schema.table};`,
            values: []
        }

        const result = await query(statement)
        return result.rows.map(row => extractUnavailableReasons(row))
    }


    function extractUnavailableReasons(row) {
        return {
            unavailableReason: row[schema.reason]
        }
    }

}
