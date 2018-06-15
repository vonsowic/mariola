const db = require('database');
const date = require('utils/datetime');


const findWithNumberOfDetailsAndStudents = facultyId=> db.connection.query(`
    WITH usertmp AS (
        SELECT 
            c.id as id, 
            count(uc."userId") as "studentsCount" 
        FROM courses c 
        LEFT JOIN user_courses uc ON c.id=uc."courseId" 
        GROUP BY c.id),
    cdtmp AS (
        SELECT 
            c.id as id, 
            count(cd."courseId") as frequency, 
            extract(dow from cd.start) as dow, 
            to_char(cd.start, 'HH24:MI') as st, 
            to_char(cd.end, 'HH24:MI') as en 
        FROM courses c 
        JOIN courses_details cd ON c.id=cd."courseId" 
        GROUP BY c.id, "st", "en", "dow"),
    maxnumenabled AS (
        SELECT id as "facultyId", "transferWithoutExchangeEnabled" as enabled
        FROM faculties
        WHERE id=${facultyId}
    )
    SELECT 
        c.id,
        c.name,
        c.group,
        utmp."studentsCount"::Integer, 
        (select case when mne.enabled='t' then c."maxStudentsNumber" else -1 end as "maxStudentsNumber"),
        cd.frequency::Integer, 
        cd.dow as "dayOfWeek", 
        cd.st as start, 
        cd.en as end 
    FROM courses c 
    NATURAL JOIN usertmp utmp
    NATURAL JOIN cdtmp cd
    NATURAL JOIN maxnumenabled mne
    WHERE c."facultyId"=${facultyId};`);


const findCoursesIdsByUserId = userId =>
    db.Course.findAll({
        attributes: ['id'],
        include: [{
            model: db.User,
            attributes: [],
            where: {
                id: userId
            }
        }]
    })
        .map(({id}) => id);


const findAll=(where={}, include=[]) =>
    db.Course.findAll({
        attributes: ['id', 'name', 'group', 'other'],
        include,
        where,
        raw: true
    });


const findAllByFaculty=(facultyId, include=[]) =>
    findAll({facultyId}, include);


const withUser= userId =>({
    model: db.User,
    attributes: [],
    where: {id: userId}
});


const withDetails= interval =>({
    model: db.CourseDetail,
    attributes: ['start', 'end'],
    where: {
        start: {
            [db.Op.gt]: interval.start || date.getMondayDate()
        },
        end: {
            [db.Op.lt]: interval.end || date.getSundayDate()
        }
    },
    raw: true
});

module.exports={
    findCoursesIdsByUserId,
    findWithNumberOfDetailsAndStudents,
    findAll,
    findAllByFaculty,
    withDetails,
    withUser
};