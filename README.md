# mariola
[![Build Status](https://travis-ci.com/vonsowic/mariola.svg?token=z5xW5WFyuttX4MbcwYmp&branch=master)](https://travis-ci.com/vonsowic/mariola?token=z5xW5WFyuttX4MbcwYmp&branch=master)

Mariola helps you organize your faculty timetable

Required environmental variables:
* CLIENT_ID=\<FACEBOOK CLIENT ID>
* CLIENT_SECRET=\<FACEBOOK CLIENT SECRET>
* DATABASE_URL=\<URL to Postgres database>
* EXPIRATION_TIME_AS_SECONDS=\<ex. 15>

Optional environmental variables:
* DROP_DATABASE=<true/false>
* DATABASE_LOGGING=<true/false>
* PORT=<default 3000>
* API_PORT=<default 5000>
* NOTIFICATION_PORT=<default 5001>
* RUN_AS=\<ONLY FOR TESTS! Facebook id of user who will be used in all callbacks>

And start developing with `npm run dev `
