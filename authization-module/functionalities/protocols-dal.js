const dalUtils = require('../common/util/dal-utils'),
    errors = require('../common/errors/app-errors')

module.exports={
    create: async (name)=>{

        var result
  
          const query = {
              statement: 'INSERT INTO Protocols(name) VALUES (?);',
              description: "adding user_session",
              params: [name]
          }
  
          try {
              result = await dalUtils.executeQuery(query)
  
          } catch (error) {
              throw error
          }
  
      },
      getAll: async ()=>{

          const query = {
              statement: 'Select * from Protocols',
              description: "Get all protocols",
          }
  
          try {
              return await dalUtils.executeQuery(query)
  
          } catch (error) {
              throw error
          }
  
      },
      get: async (name)=>{

        const query = {
            statement: 'Select * from Protocols where protocol=?',
            description: "get a specific protocol",
            params: [name]
        }

        try {
            return await dalUtils.executeQuery(query)

        } catch (error) {
            throw error
        }

    },
}