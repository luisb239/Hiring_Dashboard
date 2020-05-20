'use strict'

module.exports = () => {
    return {
        isString, isNumber, isBoolean, isDate, isArray
    }

    // Returns if a value is a string
    function isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

    // Returns if a value is really a number
    function isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }

    // Returns if a value is a boolean
    function isBoolean(value) {
        return typeof value === 'boolean';
    }

    // Returns if value is a date object
    function isDate(value) {
        return value instanceof Date;
    }

    // Returns if a value is an array
    function isArray(value) {
        return Array.isArray(value);
    }


}
