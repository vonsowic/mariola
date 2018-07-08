const { BOOLEAN, INTEGER } = require('sequelize');

module.exports={
    userId: {
        type: INTEGER,
        primaryKey: true
    },
    exchangeId: {
        type: INTEGER,
        primaryKey: true
    },
    wasRead: {
        type: BOOLEAN,
        defaultValue: false,
        required: true
    }
};