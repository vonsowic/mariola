const db = require('database');


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
});