exports.getWeatherByZipCode = async (zipCode) => {
    const key = process.env.API_KEY;
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${key}&units=imperial`)
        const data = await res.json();
        if (!res.ok) {
            console.log(`OpenWeatherMap threw an error getting the weather: ${JSON.stringify(data)}`)
        } //allows me to see openweathermap errors in cloudwatch
        return {
            statusCode: res.status,
            body: JSON.stringify(data),
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }
    } catch (error) {
        console.log(`There was an error fetching the weather in the lambda: ${error}`)
    }
}