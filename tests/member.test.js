const request = require('supertest');
const app = require('./../app');
const bodyParser = require('body-parser');

async function loginAdmin() {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const resp = await request(app).post("/login").send({
        "mail": "touroncamille@icloud.com",
        "password": "admin"
    });
    const token = resp.token;
    return token;
}


describe('Get members with admin token.', () => {
    it('should return list of members', async () => {
        const token = await loginAdmin();
        const resp = await request(app).set('token', token).get('/books');
        expect(resp.statusCode).toEqual(200);
    });
});