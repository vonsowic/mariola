require('dotenv').config();
require('database').connection.sync({force: process.env.DROP_DATABASE});

const app = require('../app');
const notificationService = require('notification-service');

app.listen(process.env.API_PORT || 5000);
notificationService(process.env.NOTIFICATION_PORT || 5001);