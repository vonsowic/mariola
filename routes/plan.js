const router = require('express').Router();
const db = require('database');
const NotFound = require('utils/errors').NotFound;

router.get('/:facultyId/my', (req, res)=>{
    db.Course().findAll({
        include: {
            model: db.UserCourse,
            where: { userId: req.user.id },
            // attributes: ['imgUrl'],
            // through: { attributes: [] }
        }
    })
});

module.exports=router;