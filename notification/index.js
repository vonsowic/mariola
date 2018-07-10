require('dotenv').config();

const notificationService = require('./notification-app');

notificationService(process.env.NOTIFICATION_PORT || process.env.PORT || 5001);
