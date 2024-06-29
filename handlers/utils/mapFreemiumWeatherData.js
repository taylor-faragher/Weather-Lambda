const mapFreemiumWeatherData = async (data, city = 'Washington') => {
    if (!data) {
        return;
    }

    const mappedData = {
        coordinates: {
            lon: data.lon,
            lat: data.lat,
        },
        current: {
            temperature: Math.round(data.current.temp),
            icon: data.current.weather[0].icon,
            description: data.current.weather[0].description,
        },
        area: {
            timezone: data.timezone,
            majorCity: city,
        },
    };

    return mappedData;
};

export default mapFreemiumWeatherData;
