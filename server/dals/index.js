'use strict'

const {Pool} = require('pg')
const pool = new Pool()

function query(text, params) {
    return pool.query(text, params)
}

module.exports = () => {

    const request = require('./requestDal.js')(query)
    const candidate = require('./candidateDal.js')(query)
    const skill = require('./requestAttrDal/skillDal.js')(query)

    return {
        request, candidate, skill
    }
}
