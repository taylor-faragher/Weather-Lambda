import {getWeatherFreemium} from './getWeatherFreemium';
import mapFreemiumWeatherData from './utils/mapFreemiumWeatherData';

jest.mock('./utils/mapFreemiumWeatherData');

describe('getFreemiumWeather', () => {
    const API_KEY = 'test-api-key';
    const MOCK_GEOLOCATION_DATA = {lat: 38.9072, lon: -77.0369, name: 'Washington'};
    const MOCK_WEATHER_DATA = {
        current: {temp: 70},
        daily: [],
        hourly: [],
    };
    const MAPPED_DATA = {temperature: 70};
    const mockCity = 'Washington';

    beforeAll(() => {
        process.env.API_KEY = API_KEY;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock fetch differently for geolocation and onecall APIs
        global.fetch = jest.fn(url => {
            if (url.includes('api.openweathermap.org/geo/1.0/zip')) {
                return Promise.resolve({
                    json: () => Promise.resolve(MOCK_GEOLOCATION_DATA),
                    ok: true,
                    status: 200,
                });
            } else if (url.includes('api.openweathermap.org/data/3.0/onecall')) {
                return Promise.resolve({
                    json: () => Promise.resolve(MOCK_WEATHER_DATA),
                    ok: true,
                    status: 200,
                });
            }
            return Promise.reject(new Error('Unknown fetch URL'));
        });
        mapFreemiumWeatherData.mockResolvedValue(MAPPED_DATA);
    });

    afterAll(() => {
        delete process.env.API_KEY;
    });

    it('should return weather data for a valid zip code', async () => {
        const event = {
            queryStringParameters: {zipcode: '12345'},
        };

        const response = await getWeatherFreemium(event);

        expect(global.fetch).toHaveBeenCalledWith(
            `http://api.openweathermap.org/geo/1.0/zip?zip=12345,US&appid=${API_KEY}`
        );
        expect(global.fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${MOCK_GEOLOCATION_DATA.lat}&lon=${MOCK_GEOLOCATION_DATA.lon}&exclude=minutely&appid=${API_KEY}&units=imperial`
        );
        expect(mapFreemiumWeatherData).toHaveBeenCalledWith(MOCK_WEATHER_DATA, mockCity);

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify(MAPPED_DATA),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should return weather data for the default zip code if no query parameters are provided', async () => {
        const event = {};

        const response = await getWeatherFreemium(event);

        expect(global.fetch).toHaveBeenCalledWith(
            `http://api.openweathermap.org/geo/1.0/zip?zip=20005,US&appid=${API_KEY}`
        );
        expect(global.fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${MOCK_GEOLOCATION_DATA.lat}&lon=${MOCK_GEOLOCATION_DATA.lon}&exclude=minutely&appid=${API_KEY}&units=imperial`
        );
        expect(mapFreemiumWeatherData).toHaveBeenCalledWith(MOCK_WEATHER_DATA, mockCity);

        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify(MAPPED_DATA),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should return a 404 error for a zip code that is not 5 digits', async () => {
        const event = {
            queryStringParameters: {zipcode: '123'},
        };

        const response = await getWeatherFreemium(event);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should return a 400 error if zipcode parameter is missing', async () => {
        const event = {
            queryStringParameters: {otherParam: 'someValue'},
        };

        const response = await getWeatherFreemium(event);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(response).toEqual({
            statusCode: 400,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should return a 404 error if geolocation data is incomplete', async () => {
        global.fetch = jest.fn(url => {
            if (url.includes('api.openweathermap.org/geo/1.0/zip')) {
                return Promise.resolve({
                    json: () => Promise.resolve({lat: 38.9072}), // Missing lon and name
                    ok: true,
                    status: 200,
                });
            } else if (url.includes('api.openweathermap.org/data/3.0/onecall')) {
                return Promise.resolve({
                    json: () => Promise.resolve(MOCK_WEATHER_DATA),
                    ok: true,
                    status: 200,
                });
            }
            return Promise.reject(new Error('Unknown fetch URL'));
        });

        const event = {
            queryStringParameters: {zipcode: '12345'},
        };

        const response = await getWeatherFreemium(event);

        expect(global.fetch).toHaveBeenCalledWith(
            `http://api.openweathermap.org/geo/1.0/zip?zip=12345,US&appid=${API_KEY}`
        );
        expect(global.fetch).not.toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${MOCK_GEOLOCATION_DATA.lat}&lon=${MOCK_GEOLOCATION_DATA.lon}&exclude=minutely&appid=${API_KEY}&units=imperial`
        );
        expect(mapFreemiumWeatherData).not.toHaveBeenCalled();

        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({
                error: 'Geolocation data incomplete! We cant do it Johnny! Get out! Error: {"lat":38.9072}',
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });
});
