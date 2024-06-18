import getWeather from './getWeather';
import getWeatherByZipCode from './getWeatherByZipCode';

export const handler = async event => {
    let operation;
    let zipCode;
    let result;
    let city;
    let state;

    if (!event.queryStringParameters) {
        operation = 'weather';
    } else {
        if (event.queryStringParameters.zipcode) {
            zipCode = event.queryStringParameters.zipcode;
        }
        if (event.queryStringParameters.city) {
            city = event.queryStringParameters.city;
        }

        if (event.queryStringParameters.state) {
            state = event.queryStringParameters.state;
        }

        if (city && state) {
            operation = 'cityLookup';
        }

        if (zipCode) {
            operation = 'zipCode';
        }
    }
    console.log('operation: ', operation);

    switch (operation) {
        case 'weather': {
            result = await getWeather();
            break;
        }
        case 'zipCode': {
            console.log('zipCode: ', zipCode);
            result = await getWeatherByZipCode(zipCode.toString());
            break;
        }
        case 'cityLookup': {
            result = new Promise(resolve => {
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({message: 'Not Implemented yet!'}),
                });
            });
            break;
        }
        default: {
            result = new Promise(resolve => {
                resolve({
                    statusCode: 400,
                    body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
                });
            });
            break;
        }
    }
    return result;
};
