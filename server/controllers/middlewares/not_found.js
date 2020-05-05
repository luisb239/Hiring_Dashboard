'use strict'

module.exports = function(req, res) {
    res.status(404).send({error: "Resource not found"})
}
