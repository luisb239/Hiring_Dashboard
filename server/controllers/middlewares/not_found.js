'use strict'

module.exports = function (req, res) {
    res.status(404).send({status: 404, error: "Resource not found", path: req.url})
}
