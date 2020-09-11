'use strict'

module.exports = function (req, res) {
    res.status(404).send({status: 404, title: "Resource not found", detail: req.url})
}
