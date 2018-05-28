# mariola
[![Build Status](https://travis-ci.com/vonsowic/mariola.svg?token=z5xW5WFyuttX4MbcwYmp&branch=master)](https://travis-ci.com/vonsowic/mariola?token=z5xW5WFyuttX4MbcwYmp&branch=master)

Mariola helps you organize your faculty timetable

Required environmental variables:
* CLIENT_ID=\<FACEBOOK CLIENT ID>
* CLIENT_SECRET=\<FACEBOOK CLIENT SECRET>
* DATABASE_URL=\<URL to database(Postgres preferred)>
* EXPIRATION_TIME_AS_SECONDS=\<ex. 15>

Optional environmental variables:
* DROP_DATABASE=<true/false>
* DATABASE_LOGGING=<true/false>
* JWT_SECRET=\<some random string>
* PORT=<default 3000>
* API_PORT=<default 5000>
* NOTIFICATION_PORT=<default 5001>

And start developing with `npm run dev `
