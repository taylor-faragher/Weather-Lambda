import mapWeatherData from './utils/mapWeatherData';

const getWeather = async () => {
    const key = process.env.API_KEY;
    try {
        const oneCall = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=38.9067&lon=-77.0312&exclude=minutely&appid=${key}&units=imperial`
        );
        const oneCallData = await oneCall.json();

        if (oneCall.status !== 200) {
            //allows me to see openweathermap errors in cloudwatch
            console.log(`OpenWeatherMap threw an error getting the weather: ${JSON.stringify(oneCallData)}`);
            return {
                statusCode: oneCall.status,
                body: JSON.stringify(oneCallData),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        } else {
            const mappedData = await mapWeatherData(oneCallData);
            return {
                statusCode: oneCall.status,
                body: JSON.stringify(mappedData),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }
    } catch (error) {
        console.log(`There was an error fetching the weather in the lambda: ${error}`);
    }
};

export default getWeather;
