const Recruiter = require('utils/Recruiter');
const db = require('database');


const createFaculty = async (name, userId, initialGroup) => {
    let createdFaculty = await db.Faculty
        .create({
            name,
        });

    await Recruiter.begin()
        .withUser(userId)
        .toFaculty(createdFaculty.id)
        .asAdmin()
        .inGroup(initialGroup)
        .end();


    return createdFaculty
};

module.exports={
    createFaculty
};