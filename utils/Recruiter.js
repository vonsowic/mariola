const db = require('database');

class Recruiter {
    constructor(){
        this.isAdmin = false;
    }

    static begin(){
        return new Recruiter()
    }

    withUser(userId){
        this.userId = userId;
        return this
    }

    toFaculty(facultyId){
        this.facultyId = facultyId;
        return this
    }

    asAdmin(value=true){
        this.isAdmin = value;
        return this
    }

    inGroup(group){
        this.group = group;
        return this
    }

    end(){
        return db.UserFaculty
            .create({
                userId: this.userId,
                facultyId: this.facultyId,
                isAdmin: this.isAdmin,
                group: this.group
            })
            .then(uf => db.Course.findAll({where: {
                    facultyId: uf.facultyId,
                    group:{
                        [db.Op.or]: ['0', this.group, this.group[0]]
                    }
            }}))
            .then(courses => courses.map(c => ({ userId: this.userId, courseId: c.id})))
            .then(ucItems => db.UserCourse.bulkCreate(ucItems))
    }
}

module.exports=Recruiter;