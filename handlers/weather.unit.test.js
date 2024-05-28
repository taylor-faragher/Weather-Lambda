/* eslint-disable @typescript-eslint/no-var-requires */
const {handler} = require('./weather');
const weatherService = require('./getWeather');
const weatherByZipCodeService = require('./getWeatherByZipCode');

jest.mock('./getWeather');
jest.mock('./getWeatherByZipCode');

describe('Weather Handler Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches default Washington DC weather when no parameters are given', async () => {
        const event = {};
        weatherService.getWeather.mockResolvedValue('default weather data');

        const result = await handler(event);

        expect(weatherService.getWeather).toHaveBeenCalled();
        expect(result).toBe('default weather data');
    });

    it('fetches weather by zipcode', async () => {
        const event = {queryStringParameters: {zipcode: '10001'}};
        weatherByZipCodeService.getWeatherByZipCode.mockResolvedValue('weather data by zip code');

        const result = await handler(event);

        expect(weatherByZipCodeService.getWeatherByZipCode).toHaveBeenCalledWith('10001');
        expect(result).toBe('weather data by zip code');
    });

    it('returns not implemented message for city and state lookup', async () => {
        const event = {queryStringParameters: {city: 'New York', state: 'NY'}};

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({message: 'Not Implemented yet!'}),
        });
    });

    it('returns 400 when for city lookup when state is missing', async () => {
        const event = {queryStringParameters: {city: 'New York'}}; // No state provided

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
        });
    });

    it('returns 400 when for city lookup when city is missing', async () => {
        const event = {queryStringParameters: {state: 'NY'}}; // No city provided

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
        });
    });

    it('returns bad request when both city and state are provided without values', async () => {
        const event = {queryStringParameters: {city: '', state: ''}};

        const result = await handler(event);

        expect(result).toEqual({
            statusCode: 400,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
        });
    });
});
