'use strict'

module.exports = (db) => {

    return {getSkills}

    async function getSkills() {
        const skills = await db.getSkills()
        return {skills : skills}
    }
}
