const getWeather = async () => {
    const key = process.env.API_KEY;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=20005&appid=${key}&units=imperial`);
    if (res.ok) {
        const data = await res.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
    }
}

const getWeatherByZipCode = async (zipCode) => {
    const key = process.env.API_KEY;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${key}&units=imperial`)
    if (res.ok) {
        const data = await res.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        }
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