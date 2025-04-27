import logger from './logger';

const mapFreemiumWeatherData = async (data, city = 'Washington') => {
    if (!data) {
        logger.error('No data received for mapping');
        throw new Error('No data received for mapping');
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
            minTemperature: Math.round(data.daily[0].temp.min),
            maxTemperature: Math.round(data.daily[0].temp.max),
            windSpeed: Math.round(data.current.wind_speed),
        },
        area: {
            timezone: data.timezone,
            majorCity: city,
        },
    };

    return mappedData;
};

export default mapFreemiumWeatherData;
