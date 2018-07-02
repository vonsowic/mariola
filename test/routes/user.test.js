const app = require('../../app');
const chai= require('chai');
const chaiHttp = require('chai-http');

const {
    createUser
} = require('../dbhelper');

chai.use(chaiHttp);
const {
    assert,
    request
} = chai;

describe('User test', () => {
    describe('GET /api/user/me', () => {
        beforeEach(async () => {
            await createUser(null, "Jaś", "Fasola")
        });

        describe('', () => {
            it('Should return Jaś Fasola user', () => {
                request(app)
                    .get('/api/users/me')
                    .end((err, res) => {
                        assert.equal(res.status, 200);
                        assert.equal(res.body.name, "Jaś", "Expected name to be Jaś, not " + res.body.name);
                        assert.equal(res.body.lastName, "Fasola", "Expected last name to be Fasola, not " + res.body.lastName)
                    })
            });
        });
    });
});