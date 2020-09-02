module.exports = {
    statusMessage: (name, description, oldStatus, newStatus) =>
        `The candidate "${name}" status, in the "${description}" request, has been changed. `+
        `Changed from "${oldStatus}" to "${newStatus}".`,
    movedMessage: (name, description, oldPhase, newPhase) =>
        `The candidate "${name}" in the "${description}" request has been moved from ` +
         `"${oldPhase}" to "${newPhase}".`,
    assignedMessage: (description, currentUsername) =>
        `You have been assigned to the "${description}" request by the user ${currentUsername}.`
}
