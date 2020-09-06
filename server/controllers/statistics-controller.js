'use strict'

module.exports = (service) => {

    return {
        getStatistics: getStatistics,
        saveUserStatisticsConfigs: saveUserStatisticsConfigs,
        getUserStatisticsConfigs: getUserStatisticsConfigs,
        getUserStatisticsConfigsDetails: getUserStatisticsConfigsDetails
    }


    async function getStatistics(req, res) {
        const statistics = await service.getStatistics()
        res.status(200).send(statistics)
    }

    async function saveUserStatisticsConfigs(req, res) {
        const createdProfile = await service.saveUserStatisticsConfigs({
            userId: req.user.id,
            name: req.body.name,
            configs: req.body.report
        })
        res.status(200).send({
            id: {
                userId: createdProfile.userId,
                profileName: createdProfile.profileName
            }
        })
    }

    async function getUserStatisticsConfigs(req, res) {
        const userConfigs = await service.getUserStatisticsConfigs({
            userId: req.user.id
        })
        res.status(200).send({configs: userConfigs})
    }

    async function getUserStatisticsConfigsDetails(req, res) {
        const userConfigs = await service.getUserStatisticsConfigsDetails({
            userId: req.user.id,
            profileName: req.params.name
        })
        res.status(200).send(userConfigs)
    }

}
