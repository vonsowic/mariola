const Symbol = require('sequelize');

module.exports = {
    gen_plan_id: Symbol.UUID,
    course_name: Symbol.STRING,
    predefined_group: Symbol.STRING
};