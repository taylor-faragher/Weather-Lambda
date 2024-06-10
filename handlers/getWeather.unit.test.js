/* eslint-disable @typescript-eslint/no-var-requires */
const {getWeather} = require('./getWeather');
const mapper = require('./utils/mapWeatherData');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({weather: 'sunny'}),
        status: 200,
    })
);

jest.mock('./utils/mapWeatherData');

describe('getWeather', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEY = 'fake_api_key';
    });

    it('should return weather data when fetch is successful', async () => {
        const mockData = {weather: 'sunny'};
        const mockMappedData = {weather: 'mapped sunny'};

        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(mockData),
        });

        mapper.mapWeatherData.mockReturnValue(mockMappedData);

        const result = await getWeather();

        expect(fetch).toHaveBeenCalledWith(
            'https://api.openweathermap.org/data/2.5/weather?zip=20005&appid=fake_api_key&units=imperial'
        );
        expect(mapper.mapWeatherData).toHaveBeenCalledWith(mockData);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(mockMappedData),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should log an error and not throw if fetch fails', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockRejectedValue(new Error('Fetch failed'));

        await getWeather();

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'There was an error fetching the weather in the lambda: Fetch failed'
        );
        consoleLogSpy.mockRestore();
    });

    it('should log an OpenWeatherMap error if the response is not ok', async () => {
        const mockData = {message: 'Not Found'};
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: jest.fn().mockResolvedValue(mockData),
        });

        await getWeather();

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'OpenWeatherMap threw an error getting the weather: {"message":"Not Found"}'
        );
        consoleLogSpy.mockRestore();
    });
});
