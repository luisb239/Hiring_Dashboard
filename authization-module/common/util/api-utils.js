'use strict'

module.exports = {

    /**
     * set a basic response if request was executed succesfully
     * @param res
     * @param answer
     * @param statusCode
     */
    setResponse: (res, answer, statusCode) => {
        res.status(statusCode)
        res.headers = {
            'Content-type': 'application/json'
        }
        res.send(answer)
    }

}
