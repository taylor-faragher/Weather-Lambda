import mapWeatherData from './utils/mapWeatherData';

const getWeatherByZipCode = async zipCode => {
    const key = process.env.API_KEY;
    try {
        const geolocationResponse = await fetch(
            `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${key}`
        );
        const data = await geolocationResponse.json();
        const lat = data.lat;
        const lon = data.lon;

        let oneCallData = {};
        let oneCall;
        if (geolocationResponse.status == 200) {
            oneCall = await fetch(
                `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${key}&units=imperial`
            );
            oneCallData = await oneCall.json();
        }

        if (geolocationResponse.status !== 200 || oneCall.status !== 200) {
            //allows me to see openweathermap errors in cloudwatch
            console.log(`OpenWeatherMap threw an error getting the weather`);
            return {
                statusCode: geolocationResponse.status !== 200 ? geolocationResponse.status : oneCall.status,
                body: geolocationResponse.status !== 200 ? JSON.stringify(data) : JSON.stringify(oneCallData),
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

export default getWeatherByZipCode;
