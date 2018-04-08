require('dotenv').config();
require('database').connection.sync({force: process.env.DROP_DATABASE});

const app = require('../app');

app.listen(process.env.API_PORT || 5000);
