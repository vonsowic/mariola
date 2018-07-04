const userId = process.argv[2];
const facultyId = process.argv[3];
const group = process.argv[4];
const isAdmin = process.argv[5] === 'admin';


if ( !facultyId || !userId || !group) {
    console.log("run with parameters [USER ID] [FACULTY ID] [GROUP(ex. 1b)] [OPTIONAL admin]");
    process.exit(1)
} else {
    require('dotenv').config();

    const db = require('database');
    const Recruiter = require('utils/Recruiter');

    db.connection.sync({force: false})
        .then(() => {
            Recruiter.begin()
                .withUser(userId)
                .toFaculty(facultyId)
                .inGroup(group)
                .asAdmin(isAdmin)
                .end()
                .then(() => console.log('Success'))
                .catch(err => {
                    console.log("ERROR!");
                    console.log(err)
                })
                .finally(() => {
                    db.connection.close()
                })
        })
}
