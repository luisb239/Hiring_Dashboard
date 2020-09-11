'use strict'

// https://www.postgresql.org/docs/12/errcodes-appendix.html

module.exports = {
    foreignKeyViolation: 'Foreign Key Violation',
    uniqueViolation: 'Unique Violation',
    internalError: 'Postgresql Internal Error'
}
