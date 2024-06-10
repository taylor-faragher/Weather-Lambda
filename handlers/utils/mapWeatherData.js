exports.mapWeatherData = data => {
    if (!data) {
        return;
    }
    const mappedData = {
        coordinates: {
            lon: data.coord.lon,
            lat: data.coord.lat,
        },
        weather: {
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            feelsLike: data.main.feels_like,
            pressure: data.main.pressure,
            humidity: data.main.humidity,
            visibility: data.visibility,
            windSpeed: data.wind.speed,
            windDirection: data.wind.deg,
        },
        area: {
            country: data.sys.country,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
            timezone: data.timezone,
            majorCity: data.name,
        },
    };
    return mappedData;
};
