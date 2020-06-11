const moment = require('moment'),
    dalUtils = require('../common/util/dal-utils'),
    errors=require('../common/errors/app-errors')
module.exports = {
    create: async (user_id,session_id)=>{

      var result

        const query = {
            statement: 'INSERT INTO Users_Sessions(user_id,session_id) VALUES (?,?);',
            description: "adding user_session",
            params: [user_id,session_id]
        }

        try {
            result = await dalUtils.executeQuery(query)

        } catch (error) {
            throw error
        }

    }
}