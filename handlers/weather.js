const getWeather = async () => {
    const key = process.env.API_KEY;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=2000&appid=${key}&units=imperial`);
        const data = await res.json();
        if (!res.ok) {
            console.log(`OpenWeatherMap threw an error getting the weather: ${JSON.stringify(data)}`)
        } //allows me to see openweathermap errors in cloudwatch
        return {
            statusCode: res.status,
            body: JSON.stringify(data)
        }
    } catch (error) {
        console.log(`There was an error fetching the weather in the lambda: ${error}`)
    }
}

const getWeatherByZipCode = async (zipCode) => {
    const key = process.env.API_KEY;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${key}&units=imperial`)
        const data = await res.json();
        if (!res.ok) {
            console.log(`OpenWeatherMap threw an error getting the weather: ${JSON.stringify(data)}`)
        } //allows me to see openweathermap errors in cloudwatch
        return {
            statusCode: res.status,
            body: JSON.stringify(data)
        }
    } catch (error) {
        console.log(`There was an error fetching the weather in the lamba: ${error}`)
    }
}

exports.handler = async function (event) {
    let operation = 'weather';
    let zipCode = 20005;
    let result;
    let city;
    let state;

    if (event.queryStringParameters && event.queryStringParameters.zipcode) {
        console.log("zipCode: " + event.queryStringParameters.zipcode);
        zipCode = event.queryStringParameters.zipcode;
        operation = 'zipCode';
    }

    if (event.queryStringParameters && event.queryStringParameters.city) {
        console.log("city: " + event.queryStringParameters.city);
        city = event.queryStringParameters.city;
    }

    if (event.queryStringParameters && event.queryStringParameters.state) {
        console.log("state: " + event.queryStringParameters.state);
        state = event.queryStringParameters.state;
    }

    if (city && state) {
        operation = 'cityLookup';
    }

    console.log('operation: ', operation, ' and zipcode: ', zipCode);

    switch (operation) {
        case 'weather': {
            result = await getWeather();
            break;
        }
        case 'zipCode': {
            const stringZip = zipCode.toString();
            result = await getWeatherByZipCode(stringZip)
            break;
        }
        case 'cityLookup': {
            result = 'Not implemented yet';
            break;
        }
        default: {
            result = 'No weather for you';
            break;
        }
    }
    return result;
};