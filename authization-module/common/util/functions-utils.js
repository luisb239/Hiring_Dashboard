const sequelizeErrorsMapper = require('../errors/sequelize-errors-mapper');
/**
 * runs the provided function and returns his result or one of our errors
 * @param {function} fnToRun
 * @returns {Promise<Object|Error>}
 */
module.exports = async fnToRun => {

    try {
        return await fnToRun();
    } catch (error) {
        throw sequelizeErrorsMapper(error);
    }

};
