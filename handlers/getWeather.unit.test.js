import getWeather from './getWeather';
import mapWeatherData from './utils/mapWeatherData';

jest.mock('./utils/mapWeatherData');

describe('getWeather', () => {
    const API_KEY = 'test-api-key';
    const MOCK_WEATHER_DATA = {temp: 70};
    const MAPPED_DATA = {temperature: 70};

    beforeAll(() => {
        process.env.API_KEY = API_KEY;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(MOCK_WEATHER_DATA),
                status: 200,
            })
        );
    });

    it('should return weather data on successful fetch', async () => {
        mapWeatherData.mockResolvedValue(MAPPED_DATA);

        const result = await getWeather();

        expect(fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/3.0/onecall?lat=38.9067&lon=-77.0312&exclude=minutely&appid=${API_KEY}&units=imperial`
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

    it('should log and return error response when fetch fails with non-200 status', async () => {
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({message: 'Not Found'}),
                status: 404,
            })
        );

        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const result = await getWeather();

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'OpenWeatherMap threw an error getting the weather: {"message":"Not Found"}'
        );
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

        await getWeather();

        expect(consoleLogSpy).toHaveBeenCalledWith(
            `There was an error fetching the weather in the lambda: Error: ${errorMessage}`
        );

        consoleLogSpy.mockRestore();
    });
});
