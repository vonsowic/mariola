process.env.DATABASE_URL='sqlite://mariola-test.db';
const db = require('database');
const Recruiter = require('utils/Recruiter');

module.exports = async function () {
    await db.connection.sync({force: true});

    // available faculties
    let availableComputerScience = await db.AvailableFaculty.create({
        name: 'Informatyka',
        semester: 6,
        url: 'http://planzajec.eaiib.agh.edu.pl/view/timetable/336/events'
    });

    let availableOtherFaculty = await db.AvailableFaculty.create({
        name: 'Informatyka',
        semester: 4,
        url: 'http://planzajec.eaiib.agh.edu.pl/view/timetable/334/events'
    });

    // create users
    let luke = await db.User.create({
        name: 'Luke',
        lastName: 'Skywalker',
        email: 'luke@galaxy.com',
        fbProfileId: '1'
    });
    let han = await db.User.create({
        name: 'Han',
        lastName: 'Solo',
        email: 'millenium@falcon.com',
        fbProfileId: '2'
    });
    let leia = await db.User.create({
        name: 'Leia',
        lastName: 'Organa',
        email: 'leia@alderaan.com',
        fbProfileId: '3'
    });
    let lando = await db.User.create({
        name: 'Lando',
        lastName: 'Calroslisianin',
        email: 'lando@galaxy.com',
        fbProfileId: '4'
    });
    let vader = await db.User.create({
        name: 'Darth',
        lastName: 'Vader',
        email: 'vader@deathstar.com',
        fbProfileId: '5'
    });
    let tarkin = await db.User.create({
        name: 'Wilhuff',
        lastName: 'Tarkin',
        email: 'tarkin@deathstar.com',
        fbProfileId: '6'
    });

    // create faculties
    let rebels = await db.Faculty.create({
        name: 'Sojusz rebeli',
        availableFacultyId: availableComputerScience.id
    });

    let empire = await db.Faculty.create({
        name: 'Imperium',
        availableFacultyId: availableOtherFaculty.id
    });


    // courses
    await db.Course.create({
        name: 'Lightsaber basics',
        lecturer: 'Obi-Wan Kenobi',
        group: '1',
        place: 'Yarwin',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-02 14:00:00+01',
        end: '2018-04-02 15:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-09 14:00:00+01',
        end: '2018-04-09 15:30:00+01'
    }]));

    await db.Course.create({
        name: 'Lightsaber basics',
        lecturer: 'Obi-Wan Kenobi',
        group: '2',
        place: 'Yarwin',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-03 14:00:00+01',
        end: '2018-04-03 15:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-10 14:00:00+01',
        end: '2018-04-10 15:30:00+01'
    }]));

    await db.Course.create({
        name: 'Force training',
        lecturer: 'Obi-Wan Kenobi',
        group: '1',
        place: 'Hoth',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-02 10:00:00+01',
        end: '2018-04-02 11:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-09 10:00:00+01',
        end: '2018-04-09 11:30:00+01'
    }]));

    await db.Course.create({
        name: 'Force training',
        lecturer: 'Yoda',
        group: '2',
        place: 'Degobath',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-03 10:00:00+01',
        end: '2018-04-03 11:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-10 10:00:00+01',
        end: '2018-04-10 11:30:00+01'
    }]));

    await db.Course.create({
        name: 'How to destroy rebels',
        lecturer: 'Emperor',
        group: '1',
        place: 'Death star',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-04 14:00:00+01',
        end: '2018-04-04 15:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-11 14:00:00+01',
        end: '2018-04-11 15:30:00+01'
    }]));

    await db.Course.create({
        name: 'Force choking',
        lecturer: 'Emperor',
        group: '1',
        place: 'Death star',
        facultyId: rebels.id
    }).then(c => db.CourseDetail.bulkCreate([{
        courseId: c.id,
        start: '2018-04-04 15:30:00+01',
        end: '2018-04-04 17:30:00+01'
    }, {
        courseId: c.id,
        start: '2018-04-11 15:30:00:00+01',
        end: '2018-04-11 17:30:00+01'
    }]));


    // add users to courses
    await Recruiter.begin()
        .withUser(luke.id)
        .toFaculty(rebels.id)
        .inGroup('1')
        .end();

    await Recruiter.begin()
        .withUser(leia.id)
        .toFaculty(rebels.id)
        .asAdmin()
        .inGroup('1')
        .end();

    await Recruiter.begin()
        .withUser(han.id)
        .toFaculty(rebels.id)
        .inGroup('2')
        .end();

    await Recruiter.begin()
        .withUser(lando.id)
        .toFaculty(rebels.id)
        .inGroup('2')
        .end();

    await Recruiter.begin()
        .withUser(vader.id)
        .toFaculty(rebels.id)
        .asAdmin()
        .inGroup('1')
        .end();

    await Recruiter.begin()
        .withUser(tarkin.id)
        .toFaculty(empire.id)
        .inGroup('1')
        .end();

    await Recruiter.begin()
        .withUser(lando.id)
        .toFaculty(empire.id)
        .inGroup('1')
        .end();
};

