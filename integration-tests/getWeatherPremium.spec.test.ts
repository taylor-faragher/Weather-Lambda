const baseUrl = 'https://dev.taylorsweatherapi.com';
import * as request from 'supertest';
import {authenticateUser} from './utils/authHelper';

describe('taylorsweatherapi.com - Premium', () => {
    let token: string;

    beforeAll(async () => {
        const authResponse = await authenticateUser();
        token = authResponse.idToken;
    });

    it('GET on PREMIUM endpoint with zipcode param returns weather for specific city', done => {
        request(baseUrl)
            .get('/premium?zipcode=37167')
            .set('authorization', `Bearer ${token}`)
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
                expect(res.body.current).toHaveProperty('minTemperature');
                expect(res.body.current).toHaveProperty('maxTemperature');
                expect(res.body.current).toHaveProperty('summary');
                expect(res.body.current).toHaveProperty('sunrise');
                expect(res.body.current).toHaveProperty('sunset');
                expect(res.body.current).toHaveProperty('pressure');
                expect(res.body.current).toHaveProperty('humidity');
                expect(res.body.current).toHaveProperty('visibility');
                expect(res.body.current).toHaveProperty('windSpeed');
                expect(res.body.current).toHaveProperty('windDirection');
                expect(res.body).toHaveProperty('hourly');
                expect(res.body.hourly[0]).toHaveProperty('time');
                expect(res.body.hourly[0]).toHaveProperty('temp');
                expect(res.body.hourly[0]).toHaveProperty('icon');
                expect(res.body.hourly[0]).toHaveProperty('description');
                expect(res.body).toHaveProperty('daily');
                expect(res.body.daily[0]).toHaveProperty('day');
                expect(res.body.daily[0]).toHaveProperty('avgTemp');
                expect(res.body.daily[0]).toHaveProperty('minTemp');
                expect(res.body.daily[0]).toHaveProperty('maxTemp');
                expect(res.body.daily[0]).toHaveProperty('icon');
                expect(res.body.daily[0]).toHaveProperty('description');
                expect(res.body.daily[0]).toHaveProperty('summary');
                expect(res.body.daily[0]).toHaveProperty('sunrise');
                expect(res.body.daily[0]).toHaveProperty('sunset');
                expect(res.body).toHaveProperty('area');
                expect(res.body.area).toHaveProperty('timezone');
                expect(res.body.area).toHaveProperty('majorCity');
                expect(res.body.area.majorCity).toEqual('Smyrna');
                return done();
            });
    });

    it('GET on PREMIUM endpoint with zipcode param returns weather for specific city', done => {
        request(baseUrl)
            .get('/premium')
            .set('authorization', `Bearer ${token}`)
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
                expect(res.body.current).toHaveProperty('minTemperature');
                expect(res.body.current).toHaveProperty('maxTemperature');
                expect(res.body.current).toHaveProperty('summary');
                expect(res.body.current).toHaveProperty('sunrise');
                expect(res.body.current).toHaveProperty('sunset');
                expect(res.body.current).toHaveProperty('pressure');
                expect(res.body.current).toHaveProperty('humidity');
                expect(res.body.current).toHaveProperty('visibility');
                expect(res.body.current).toHaveProperty('windSpeed');
                expect(res.body.current).toHaveProperty('windDirection');
                expect(res.body).toHaveProperty('hourly');
                expect(res.body.hourly[0]).toHaveProperty('time');
                expect(res.body.hourly[0]).toHaveProperty('temp');
                expect(res.body.hourly[0]).toHaveProperty('icon');
                expect(res.body.hourly[0]).toHaveProperty('description');
                expect(res.body).toHaveProperty('daily');
                expect(res.body.daily[0]).toHaveProperty('day');
                expect(res.body.daily[0]).toHaveProperty('avgTemp');
                expect(res.body.daily[0]).toHaveProperty('minTemp');
                expect(res.body.daily[0]).toHaveProperty('maxTemp');
                expect(res.body.daily[0]).toHaveProperty('icon');
                expect(res.body.daily[0]).toHaveProperty('description');
                expect(res.body.daily[0]).toHaveProperty('summary');
                expect(res.body.daily[0]).toHaveProperty('sunrise');
                expect(res.body.daily[0]).toHaveProperty('sunset');
                expect(res.body).toHaveProperty('area');
                expect(res.body.area).toHaveProperty('timezone');
                expect(res.body.area).toHaveProperty('majorCity');
                expect(res.body.area.majorCity).toEqual('Washington');
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
                expect(res.body.message).toEqual('not found');
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
});
