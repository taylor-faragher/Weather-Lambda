const baseUrl = 'https://dev.taylorsweatherapi.com';
import * as request from 'supertest';

describe('taylorsweatherapi.com', () => {
    it('GET with no params returns weather for default city, Washington DC', done => {
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
                expect(res.body.name).toEqual('Washington');
                expect(res.body).toHaveProperty('timezone');
                return done();
            });
    });

    it('GET with zipcode param returns weather for specific city', done => {
        request(baseUrl)
            .get('/?zipcode=37167')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('coord');
                expect(res.body).toHaveProperty('weather');
                expect(res.body).toHaveProperty('base');
                expect(res.body).toHaveProperty('main');
                expect(res.body).toHaveProperty('visibility');
                expect(res.body).toHaveProperty('wind');
                expect(res.body.name).toEqual('Smyrna');
                expect(res.body).toHaveProperty('timezone');
                return done();
            });
    });

    it('GET with partial zipcode param returns a 404 city not found message', async () => {
        request(baseUrl)
            .get('/?zipcode=371')
            .expect(404)
            .then(res => {
                expect(res.body).toHaveProperty('cod');
                expect(res.body.cod).toEqual('404');
                expect(res.body).toHaveProperty('message');
                expect(res.body.message).toEqual('city not found');
            })
            .catch(err => {
                throw err;
            });
    });

    it('GET with empty zipcode param returns a 400 bad request', async () => {
        request(baseUrl)
            .get('/?zipcode=')
            .expect(400)
            .then(res => {
                expect(res.body.error).toEqual('Bad Request. Please send correct data.');
            })
            .catch(err => {
                throw err;
            });
    });

    it('GET with random param returns a 400 bad request', async () => {
        request(baseUrl)
            .get('/?random=')
            .expect(400)
            .then(res => {
                expect(res.body.error).toEqual('Bad Request. Please send correct data.');
            })
            .catch(err => {
                throw err;
            });
    });

    it('GET with city and state params returns a 200 request with no weather', async () => {
        request(baseUrl)
            .get('?city=Nashville&state=TN')
            .expect(200)
            .then(res => {
                expect(res.body.message).toEqual('Not Implemented yet!');
            })
            .catch(err => {
                throw err;
            });
    });

    it('GET with city params ONLY returns a 400 bad request', async () => {
        request(baseUrl)
            .get('?city=Nashville')
            .expect(400)
            .then(res => {
                expect(res.body.error).toEqual('Bad Request. Please send correct data.');
            })
            .catch(err => {
                throw err;
            });
    });
});
