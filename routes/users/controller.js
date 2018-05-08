const router = require('express').Router();



const db = require('database');


router.get('/me', (req, res) => {
    res.send(req.user)
});

//TODO remove
router.get('/mockd', async (req, res) => {
    res.send("okss");
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

});





module.exports = router;
