const baseUrl = 'https://dev.taylorsweatherapi.com';
import * as request from 'supertest';

describe('taylorsweatherapi.com', () => {
    it('GET with no params returns weather for default city, Washington DC', done => {
        request(baseUrl)
            .get('/')
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('coordinates');
                expect(res.body.coordinates).toHaveProperty('lon');
                expect(res.body.coordinates).toHaveProperty('lat');
                expect(res.body).toHaveProperty('weather');
                expect(res.body.weather).toHaveProperty('description');
                expect(res.body.weather).toHaveProperty('icon');
                expect(res.body.weather).toHaveProperty('temperature');
                expect(res.body.weather).toHaveProperty('feelsLike');
                expect(res.body.weather).toHaveProperty('pressure');
                expect(res.body.weather).toHaveProperty('humidity');
                expect(res.body.weather).toHaveProperty('visibility');
                expect(res.body.weather).toHaveProperty('windSpeed');
                expect(res.body.weather).toHaveProperty('windDirection');
                expect(res.body).toHaveProperty('area');
                expect(res.body.area).toHaveProperty('country');
                expect(res.body.area).toHaveProperty('sunrise');
                expect(res.body.area).toHaveProperty('sunset');
                expect(res.body.area).toHaveProperty('timezone');
                expect(res.body.area).toHaveProperty('majorCity');
                expect(res.body.area.majorCity).toEqual('Washington');
                return done();
            });
    });

    it('GET with zipcode param returns weather for specific city', done => {
        request(baseUrl)
            .get('/?zipcode=37167')
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).toHaveProperty('coordinates');
                expect(res.body.coordinates).toHaveProperty('lon');
                expect(res.body.coordinates).toHaveProperty('lat');
                expect(res.body).toHaveProperty('weather');
                expect(res.body.weather).toHaveProperty('description');
                expect(res.body.weather).toHaveProperty('icon');
                expect(res.body.weather).toHaveProperty('temperature');
                expect(res.body.weather).toHaveProperty('feelsLike');
                expect(res.body.weather).toHaveProperty('pressure');
                expect(res.body.weather).toHaveProperty('humidity');
                expect(res.body.weather).toHaveProperty('visibility');
                expect(res.body.weather).toHaveProperty('windSpeed');
                expect(res.body.weather).toHaveProperty('windDirection');
                expect(res.body).toHaveProperty('area');
                expect(res.body.area).toHaveProperty('country');
                expect(res.body.area).toHaveProperty('sunrise');
                expect(res.body.area).toHaveProperty('sunset');
                expect(res.body.area).toHaveProperty('timezone');
                expect(res.body.area).toHaveProperty('majorCity');
                expect(res.body.area.majorCity).toEqual('Smyrna');
                return done();
            });
    });

    it('GET with partial zipcode param returns a 404 city not found message', async () => {
        request(baseUrl)
            .get('/?zipcode=371')
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
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
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
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
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
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
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
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
            .set('x-api-key', 'uFaywcvpQj94HeeNC8ESd3w5eSS8NcxKaILjvkVq')
            .expect(400)
            .then(res => {
                expect(res.body.error).toEqual('Bad Request. Please send correct data.');
            })
            .catch(err => {
                throw err;
            });
    });

    it('GET without API key in header returns 403 Forbidden', async () => {
        request(baseUrl)
            .get('/?zipcode=37167')
            .expect(403)
            .then(res => {
                expect(res.body.message).toEqual('Forbidden');
            })
            .catch(err => {
                throw err;
            });
    });
});
