const request = require('supertest');
const app = require('./../app');

async function loginAdmin() {
    const body = {mail:"touroncamille@icloud.com",password:"admin"};
    const resp = await request(app)
        .post("/login")
        .send(body);    
    
    const token = resp.body.token;
    return token;
}


describe('Get members with admin token.', () => {
    it('should return list of members', async () => {
        const token = await loginAdmin();
        const resp = await request(app).get('/member').set('authorization', token);
        expect(resp.statusCode).toEqual(200);
    });
});