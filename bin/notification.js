require('dotenv').config();

const notificationService = require('notification-service');

notificationService(process.env.NOTIFICATION_PORT || 5001);
