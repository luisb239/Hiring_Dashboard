'use strict'

module.exports = {
    /**
     * set a basic response if request was executed succesfully
     * @param res
     * @param answer
     * @param statusCode
     */
    setResponse: (res, answer, statusCode) => {
        res.headers = {
            'Content-type': 'application/json'
        }
        res.status(statusCode).send(answer)
    }

}
