import mapPremiumWeatherData from './utils/mapPremiumWeatherData';
import logger from './utils/logger';

export const getWeatherPremium = async event => {
    let zipCode;

    logger.info('Lettuce Begin...:', {event});

    if (event.queryStringParameters && event.queryStringParameters.zipcode) {
        const zipCodeParam = event.queryStringParameters.zipcode;
        zipCode = zipCodeParam.toString();
        logger.info('Got the zipcode: ', zipCode);
        if (zipCode.length !== 5) {
            logger.warn('You are coming up short bud. Zipcode is not 5 digits.', {event});
            logger.warn('Here some bad data: ', zipCode);
            return {
                statusCode: 404,
                body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
    } else if (!event.queryStringParameters) {
        zipCode = '20005';
    } else {
        logger.warn('Danger Will Robinson! No zipcode provided.', {event});
        return {
            statusCode: 400,
            body: JSON.stringify({error: 'Bad Request. Please send correct data.'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }

    logger.info('Got the location: ', zipCode);

    const key = process.env.API_KEY;
    let data = {};
    try {
        try {
            const geolocationResponse = await fetch(
                `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${key}`
            );
            if (!geolocationResponse.ok) {
                const errorBody = await geolocationResponse.json();
                logger.error(
                    'Geolocation API returned non-ok status. It is not ok:',
                    geolocationResponse.status,
                    errorBody
                );

                return {
                    statusCode: geolocationResponse.status,
                    body: JSON.stringify({
                        error: `'Geolocation API returned non-ok status. It is not ok: ${errorBody}`,
                        details: errorBody,
                    }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                };
            }

            data = await geolocationResponse.json();
        } catch (error) {
            logger.error(
                'Failed to get geolocation data or parse it. Bummer! Here is the error from openweathermap: ',
                error
            );
            return {
                statusCode: 500,
                body: JSON.stringify({error: 'Error in Geolocation. Please try again later.'}),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        logger.info('Got the geolocation data: ', data);

        if (!data || !data.lat || !data.lon || !data.name) {
            logger.warn('Geolocation data incomplete! We cant do it Johnny! Get out!', zipCode, data);
            return {
                statusCode: 404, // Not Found
                body: JSON.stringify({
                    error: `Geolocation data incomplete! We cant do it Johnny! Get out! Error: ${JSON.stringify(data)}`,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        const lat = data.lat;
        const lon = data.lon;
        const city = data.name;

        let oneCallData = {};
        let oneCall;
        try {
            oneCall = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`
            );
            if (!oneCall.ok) {
                const errorBody = await oneCall.json();
                logger.error('Bailing on getting weather:', oneCall.status, errorBody);
                return {
                    statusCode: oneCall.status,
                    body: JSON.stringify({
                        error: `Bailing on getting weather: ${errorBody}`,
                        details: errorBody,
                    }),
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                };
            }
            oneCallData = await oneCall.json();
        } catch (error) {
            logger.error('Failed to get one call data. Bummer! Here is the error from openweathermap: ', error);
            return {
                statusCode: 500,
                body: JSON.stringify({error: 'Error in Weather Call. Please try again later.'}),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
        logger.info('Got the one call data. Sweet! Check it: ', oneCallData);

        const mappedData = await mapPremiumWeatherData(oneCallData, city);

        logger.info('It has been quite a journey. Here is our reward: ', mappedData);
        return {
            statusCode: oneCall.status,
            body: JSON.stringify(mappedData),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        logger.error('Error in getWeatherPremium: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: 'Internal Error in Premium Endpoint. Please try again later.'}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};
