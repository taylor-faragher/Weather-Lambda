import {getWeatherPremium} from './getWeatherPremium';
import mapPremiumWeatherData from './utils/mapPremiumWeatherData';

jest.mock('./utils/mapPremiumWeatherData');

describe('getWeatherPremium', () => {
    const API_KEY = 'test-api-key';

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEY = 'test-api-key';
        global.fetch = jest.fn();
    });

    beforeAll(() => {
        process.env.API_KEY = API_KEY;
    });

    it('should use default zip code if queryStringParameters are missing', async () => {
        fetch.mockResolvedValueOnce(
            new Response(JSON.stringify({lat: 38.9067, lon: -77.0312, name: 'Washington'}), {status: 200})
        );
        fetch.mockResolvedValueOnce(new Response(JSON.stringify({weather: 'data'}), {status: 200}));
        mapPremiumWeatherData.mockResolvedValueOnce({mapped: 'data'});

        const event = {};
        const response = await getWeatherPremium(event);

        expect(fetch).toHaveBeenCalledWith(`http://api.openweathermap.org/geo/1.0/zip?zip=20005,US&appid=${API_KEY}`);
        expect(fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=38.9067&lon=-77.0312&exclude=minutely&appid=${API_KEY}&units=imperial`
        );
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({mapped: 'data'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should return weather data for a valid zipcode', async () => {
        fetch.mockResolvedValueOnce(
            new Response(JSON.stringify({lat: 40.7128, lon: -74.006, name: 'New York'}), {status: 200})
        );
        fetch.mockResolvedValueOnce(new Response(JSON.stringify({weather: 'data'}), {status: 200}));
        mapPremiumWeatherData.mockResolvedValueOnce({mapped: 'data'});

        const event = {queryStringParameters: {zipcode: '10001'}};
        const response = await getWeatherPremium(event);

        expect(fetch).toHaveBeenCalledWith('http://api.openweathermap.org/geo/1.0/zip?zip=10001,US&appid=test-api-key');
        expect(fetch).toHaveBeenCalledWith(
            'https://api.openweathermap.org/data/3.0/onecall?lat=40.7128&lon=-74.006&exclude=minutely&appid=test-api-key&units=imperial'
        );
        expect(response).toEqual({
            statusCode: 200,
            body: JSON.stringify({mapped: 'data'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should handle errors from OpenWeatherMap', async () => {
        fetch.mockResolvedValueOnce(new Response(JSON.stringify({message: 'error'}), {status: 404}));

        const event = {queryStringParameters: {zipcode: '10001'}};
        const response = await getWeatherPremium(event);

        expect(response).toEqual({
            statusCode: 404,
            body: JSON.stringify({message: 'error'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should handle exceptions', async () => {
        fetch.mockImplementationOnce(() => {
            throw new Error('Fetch error');
        });
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const event = {queryStringParameters: {zipcode: '10001'}};
        const response = await getWeatherPremium(event);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            expect.stringContaining('There was an error fetching the weather in the lambda: Error: Fetch error')
        );
        expect(response).toBeUndefined();
    });
});
