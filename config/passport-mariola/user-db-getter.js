const db = require('database');

const formatUser = user => ({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    fbProfileId: user.fbProfileId,
    faculties: formatFaculties(user.faculties)
});

const formatFaculties = faculties => faculties
    .reduce((acc, it) =>
            Object.assign(
                acc, {
                    [it['id']]: it['user_faculty']['isAdmin']
                }),
        {});



module.exports = fbProfileId => db.User.findOne({
    where: { fbProfileId },
    attributes: ['id', 'name', 'lastName', 'fbProfileId'],
    include: {
        model: db.Faculty,
        attributes: ['id'],
        through: {
            model: db.UserFaculty,
            attributes: ['isAdmin'],
        }
    }
})
    .then(u => formatUser(u))
    .catch(() => null);