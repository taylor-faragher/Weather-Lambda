// eslint-disable-next-line @typescript-eslint/no-var-requires
const {getWeather} = require('./getWeather');

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({weather: 'sunny'}),
        status: 200,
    })
);

describe('getWeather', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockClear();
        process.env.API_KEY = 'fake_api_key'; // Mocking the API_KEY environment variable
    });

    it('should fetch weather data for default zip code when method called', async () => {
        const mockData = {weather: 'sunny'};

        const result = await getWeather();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            'https://api.openweathermap.org/data/2.5/weather?zip=20005&appid=fake_api_key&units=imperial'
        );
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(mockData),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    });

    it('should handle non-200 responses', async () => {
        const mockData = {message: 'city not found'};
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({message: 'city not found'}),
                status: 404,
            })
        );

        const result = await getWeather();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result.statusCode).toBe(404);
        expect(result.body).toBe(JSON.stringify(mockData));
    });

    it('should log an error if the fetch fails', async () => {
        fetch.mockImplementationOnce(() => Promise.reject('Networking Error'));

        const consoleSpy = jest.spyOn(console, 'log');
        const result = await getWeather();

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('There was an error fetching the weather in the lambda:')
        );
        expect(result).toBeUndefined();
        consoleSpy.mockRestore();
    });
});
