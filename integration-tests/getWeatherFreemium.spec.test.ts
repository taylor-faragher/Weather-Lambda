const baseUrl = 'https://dev.taylorsweatherapi.com';
import * as request from 'supertest';

describe('taylorsweatherapi.com - Fremium', () => {
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
                expect(res.body).toHaveProperty('current');
                expect(res.body.current).toHaveProperty('windSpeed');
                expect(res.body.current).toHaveProperty('description');
                expect(res.body.current).toHaveProperty('icon');
                expect(res.body.current).toHaveProperty('temperature');
                expect(res.body.current).toHaveProperty('minTemperature');
                expect(res.body.current).toHaveProperty('maxTemperature');
                expect(res.body.current).not.toHaveProperty('summary');
                expect(res.body.current).not.toHaveProperty('sunrise');
                expect(res.body.current).not.toHaveProperty('sunset');
                expect(res.body.current).not.toHaveProperty('pressure');
                expect(res.body.current).not.toHaveProperty('humidity');
                expect(res.body.current).not.toHaveProperty('visibility');
                expect(res.body.current).not.toHaveProperty('windDirection');
                expect(res.body).not.toHaveProperty('hourly');
                expect(res.body).not.toHaveProperty('daily');
                expect(res.body).toHaveProperty('area');
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
                expect(res.body).toHaveProperty('current');
                expect(res.body.current).toHaveProperty('description');
                expect(res.body.current).toHaveProperty('icon');
                expect(res.body.current).toHaveProperty('temperature');
                expect(res.body.current).toHaveProperty('windSpeed');
                expect(res.body.current).toHaveProperty('minTemperature');
                expect(res.body.current).toHaveProperty('maxTemperature');
                expect(res.body.current).not.toHaveProperty('summary');
                expect(res.body.current).not.toHaveProperty('sunrise');
                expect(res.body.current).not.toHaveProperty('sunset');
                expect(res.body.current).not.toHaveProperty('pressure');
                expect(res.body.current).not.toHaveProperty('humidity');
                expect(res.body.current).not.toHaveProperty('visibility');
                expect(res.body.current).not.toHaveProperty('windDirection');
                expect(res.body).not.toHaveProperty('hourly');
                expect(res.body).not.toHaveProperty('daily');
                expect(res.body).toHaveProperty('area');
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
                expect(res.body).toHaveProperty('error');
                expect(res.body.error).toEqual('Bad Request. Please send correct data.');
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
