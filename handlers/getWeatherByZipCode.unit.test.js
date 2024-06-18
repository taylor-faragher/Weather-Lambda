import getWeatherByZipCode from './getWeatherByZipCode';
import mapWeatherData from './utils/mapWeatherData';

jest.mock('./utils/mapWeatherData');

describe('getWeatherByZipCode', () => {
    const API_KEY = 'test-api-key';
    const ZIP_CODE = '20001';
    const MOCK_GEOLOCATION_DATA = {lat: 38.9067, lon: -77.0312};
    const MOCK_WEATHER_DATA = {weather: 'sunny'};
    const MAPPED_DATA = {temperature: 70};

    beforeAll(() => {
        process.env.API_KEY = API_KEY;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it('should return weather data on successful fetches', async () => {
        global.fetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(MOCK_GEOLOCATION_DATA),
                    status: 200,
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(MOCK_WEATHER_DATA),
                    status: 200,
                })
            );

        mapWeatherData.mockResolvedValue(MAPPED_DATA);

        const result = await getWeatherByZipCode(ZIP_CODE);

        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch).toHaveBeenCalledWith(
            `http://api.openweathermap.org/geo/1.0/zip?zip=${ZIP_CODE},US&appid=${API_KEY}`
        );
        expect(global.fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${MOCK_GEOLOCATION_DATA.lat}&lon=${MOCK_GEOLOCATION_DATA.lon}&exclude=minutely&appid=${API_KEY}&units=imperial`
        );
        expect(mapWeatherData).toHaveBeenCalledWith(MOCK_WEATHER_DATA);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(MAPPED_DATA),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should log and return error response when geolocation fetch fails with non-200 status', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({message: 'Not Found'}),
                status: 404,
            })
        );

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const result = await getWeatherByZipCode(ZIP_CODE);

        const expectedMessage = 'OpenWeatherMap threw an error getting the weather';

        expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
        expect(result).toEqual({
            statusCode: 404,
            body: JSON.stringify({message: 'Not Found'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });

        consoleLogSpy.mockRestore();
    });

    it('should log and return error response when one call fetch fails with non-200 status', async () => {
        global.fetch
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve(MOCK_GEOLOCATION_DATA),
                    status: 200,
                })
            )
            .mockImplementationOnce(() =>
                Promise.resolve({
                    json: () => Promise.resolve({message: 'Not Found'}),
                    status: 404,
                })
            );

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const result = await getWeatherByZipCode(ZIP_CODE);

        const expectedMessage = 'OpenWeatherMap threw an error getting the weather';

        expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
        expect(result).toEqual({
            statusCode: 404,
            body: JSON.stringify({message: 'Not Found'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });

        consoleLogSpy.mockRestore();
    });

    it('should log error when fetch throws an exception', async () => {
        const errorMessage = 'Network Error';
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        await getWeatherByZipCode(ZIP_CODE);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            `There was an error fetching the weather in the lambda: Error: ${errorMessage}`
        );

        consoleLogSpy.mockRestore();
    });
});
