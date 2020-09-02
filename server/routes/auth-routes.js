'use strict'

module.exports = function (router, authController, authModule, handle) {

    const root = 'auth'

    router.get(`/${root}/session`, handle(authController.getSession))

    router.get(`/${root}/azure`, authModule.authenticate.usingOffice365)

    router.get(`/${root}/azure/callback`, authModule.authenticate.usingOffice365Callback, (req, res) => {
        res.redirect("http://localhost:4200/")
    })

    router.post(`/${root}/logout`, authModule.authenticate.logout, handle(authController.getSession))
}
