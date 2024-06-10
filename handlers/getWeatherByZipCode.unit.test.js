/* eslint-disable @typescript-eslint/no-var-requires */
const {getWeatherByZipCode} = require('./getWeatherByZipCode');
const mapper = require('./utils/mapWeatherData');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({weather: 'sunny'}),
        status: 200,
    })
);

jest.mock('./utils/mapWeatherData');

describe('getWeatherByZipCode', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.API_KEY = 'fake_api_key';
    });

    it('should return weather data when fetch is successful', async () => {
        const mockZipCode = '20005';
        const mockData = {weather: 'sunny'};
        const mockMappedData = {weather: 'mapped sunny'};

        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: jest.fn().mockResolvedValue(mockData),
        });

        mapper.mapWeatherData.mockReturnValue(mockMappedData);

        const result = await getWeatherByZipCode(mockZipCode);

        expect(fetch).toHaveBeenCalledWith(
            `https://api.openweathermap.org/data/2.5/weather?zip=${mockZipCode}&appid=fake_api_key&units=imperial`
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
        const mockZipCode = '20005';

        fetch.mockRejectedValue(new Error('Fetch failed'));

        await getWeatherByZipCode(mockZipCode);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'There was an error fetching the weather in the lambda: Error: Fetch failed'
        );
        consoleLogSpy.mockRestore();
    });

    it('should log an OpenWeatherMap error if the response is not ok', async () => {
        const mockZipCode = '20005';
        const mockData = {message: 'Not Found'};
        const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            json: jest.fn().mockResolvedValue(mockData),
        });

        await getWeatherByZipCode(mockZipCode);

        expect(consoleLogSpy).toHaveBeenCalledWith(
            'OpenWeatherMap threw an error getting the weather: {"message":"Not Found"}'
        );
        consoleLogSpy.mockRestore();
    });
});
