const facultyName = process.argv[2];
const url = process.argv[3];


if ( !facultyName || !url) {
    console.log("run with parameters [FACULTY NAME] [URL TO PLAN]");
    process.exit(1)
} else {
    require('dotenv').config();

    const db = require('database');

    db.connection.sync({force: false})
        .then(() => {
            db.Faculty
                .create({
                    name: facultyName,
                    url
                })
        })
}
