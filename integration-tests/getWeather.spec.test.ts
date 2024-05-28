const baseUrl = 'https://dev.taylorsweatherapi.com';
import * as request from 'supertest';

describe('taylorsweatherapi GET with no params', () => {
    it('DepotRepairBuyoutSubmitted should be added to an empty list when prompted', done => {
        request(baseUrl)
            .get('/')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('coord');
                expect(res.body).toHaveProperty('weather');
                expect(res.body).toHaveProperty('base');
                expect(res.body).toHaveProperty('main');
                expect(res.body).toHaveProperty('visibility');
                expect(res.body).toHaveProperty('wind');
                expect(res.body).toHaveProperty('name');
                expect(res.body).toHaveProperty('timezone');
                return done();
            });
    });
});
