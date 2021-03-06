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
        c.other,
        utmp."studentsCount"::Integer, 
        c."maxStudentsNumber",
        cd.frequency::Integer, 
        cd.dow as "dayOfWeek", 
        cd.st as start, 
        cd.en as end
    FROM courses c 
    NATURAL JOIN usertmp utmp
    NATURAL JOIN cdtmp cd
    NATURAL JOIN maxnumenabled mne
    WHERE c."facultyId"=${facultyId};`)
    .then(res => res[0])


const findCoursesIdsByUserId = id =>
    db.Course
        .findAll({
            attributes: ['id'],
            include: [{
                model: db.User,
                where: { id },
                through: false
            }]
        })
        .map(({id}) => id);


const findAll=(where={}, include=[]) =>
    db.Course
        .findAll({
            attributes: ['id', 'name', 'group', 'other'],
            include,
            where,
            raw: true
        });


const findAllByFaculty=(facultyId, include=[]) =>
    findAll({facultyId}, include);


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
    }
});

module.exports={
    findCoursesIdsByUserId,
    findWithNumberOfDetailsAndStudents,
    findAll,
    findAllByFaculty,
    withDetails,
};