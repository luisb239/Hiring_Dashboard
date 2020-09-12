'use strict'

const templates = require('./email-templates.js')

module.exports = (userDb, transporter) => {

    return {
        notifyStatus: notifyStatus,
        notifyMoved: notifyMoved,
        notifyAssigned: notifyAssigned
    }

    async function notifyStatus({id, oldStatus, newStatus, candidate, request}) {
        await sendMultipleEmails({
            id, emailTitle: "Candidate Status Changed",
            emailContent: templates.statusMessage(candidate.name, request.description, oldStatus, newStatus)})
    }

    async function notifyMoved({id, oldPhase, newPhase, candidate, request}) {
        await sendMultipleEmails({id, emailTitle: "Moved Candidate",
            emailContent: templates.movedMessage(candidate.name, request.description, oldPhase, newPhase)})
    }

    async function notifyAssigned({userId, request, currentUsername}) {
        await sendSingularEmail({userId, emailTitle: "New Request Assignment",
            emailContent: templates.assignedMessage(request.description, currentUsername)})
    }

    async function sendMultipleEmails({id, emailTitle, emailContent}) {
        const usersInRequest = await userDb.getUsersInRequest({id})
        if (usersInRequest && usersInRequest.length > 0) {
            sendMail({
                from: 'hiring.dashboard.isel@gmail.com', // listed in rfc822 message header
                cc: usersInRequest, // listed in rfc822 message header
                subject: `${emailTitle} - HIRING DASHBOARD`,
                text: emailContent
            })
        }
    }

    async function sendSingularEmail({userId, emailTitle, emailContent}) {
        const user = await userDb.getUserById({userId})
        if (user && user.email) {
            sendMail({
                from: 'hiring.dashboard.isel@gmail.com', // listed in rfc822 message header
                to: user.email, // listed in rfc822 message header
                subject: `${emailTitle} - HIRING DASHBOARD`,
                text: emailContent
            })
        }
    }

    function sendMail(message) {
        // transporter.sendMail(message, (error) => {
        //     if (error) {
        //         console.error("Message not sent. Error -> " + error)
        //     } else {
        //         console.log("Message Sent.")
        //     }
        // })
    }
}
