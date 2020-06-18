'use strict'

// https://www.postgresql.org/docs/12/errcodes-appendix.html


// TODO -> NEEDS REFACTORING!

const typeErrors = {
    connectionException: 'Connection Exception', // Class 08 — Connection Exception
    invalidData: 'Invalid Data', // Class 22 — Data Exception
    integrityViolation: 'Integrity Constraint Violation', // Class 23 - Integrity Constraint Violation
    syntaxErrorOrAccessRuleViolation: 'Syntax Error Or Access Rule Violation', // Class 42 — Syntax Error or Access Rule Violation
    insufficientResources: 'Insufficient Resources', // Class 53 — Insufficient Resources
    pgSqlError: 'PL/pgSQL Error', // Class P0 — PL/pgSQL Error
    internalError: 'internal Error', // Class XX — Internal Error]
}

const detailErrors = {
    notNullViolation: 'Not Null Violation',
    foreignKeyViolation: 'Foreign Key Violation',
    uniqueViolation: 'Unique Violation'
}


module.exports = {
    typeErrors: typeErrors,
    detailErrors: detailErrors
}
