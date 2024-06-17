import convertToTime from './convertToTime';

const mapCurrentData = data => {
    if (!data) {
        throw new Error('Missing Data');
    }
    return {
        description: data.current.weather[0].description,
        icon: data.current.weather[0].icon,
        temperature: Math.round(data.current.temp),
        minTemperature: Math.round(data.daily[0].temp.min),
        maxTemperature: Math.round(data.daily[0].temp.max),
        summary: data.daily[0].summary,
        sunrise: convertToTime(data.daily[0].sunrise, data.timezone_offset),
        sunset: convertToTime(data.daily[0].sunset, data.timezone_offset),
        pressure: data.current.pressure,
        humidity: data.current.humidity,
        visibility: data.current.visibility,
        windSpeed: data.current.wind_speed,
        windDirection: data.current.wind_deg,
    };
};

export default mapCurrentData;
