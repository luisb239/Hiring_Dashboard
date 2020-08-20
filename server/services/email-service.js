'use strict'

module.exports = (userDb, transporter) => {

    // TODO -> MAKE A FILE WITH THE TEMPLATES

    return {
        notifyStatus,
        notifyMoved,
        notifyAssigned
    }

    async function notifyStatus({id, oldStatus, newStatus, candidate, request}) {
        await sendMultipleEmails({
            id, emailTitle: "Candidate Status Changed",
            emailContent: `The candidate "${candidate.name}" status, in the "${request.description}" request, has been changed. ` +
            `Changed from "${oldStatus}" to "${newStatus}".`})
    }

    async function notifyMoved({id, oldPhase, newPhase, candidate, request}) {
        await sendMultipleEmails({id, emailTitle: "Moved Candidate",
            emailContent: `The candidate "${candidate.name}" in the "${request.description}" request ` +
                `has been moved from "${oldPhase}" to "${newPhase}".`})
    }

    async function notifyAssigned({userId, request, currentUsername}) {
        await sendSingularEmail({userId, emailTitle: "New Request Assignment",
            emailContent: `You have been assigned to the "${request.description}" request by the user ${currentUsername}.`})
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
                subject: emailTitle,
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
