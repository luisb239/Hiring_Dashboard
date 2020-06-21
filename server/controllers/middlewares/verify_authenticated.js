'use strict'

module.exports = (req, res, next) => {
    if (req.isAuthenticated())
        return next()
    res.status(401).json({status: "Unauthorized", message: "Not Authenticated"})
}
