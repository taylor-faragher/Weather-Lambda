import convertToTime from './convertToTime';
import convertToDay from './convertToDay';

const mapDailyData = (dailyData, offset) => {
    if (!dailyData || !offset) {
        throw new Error('Missing Daily Data');
    }
    return dailyData.slice(1, 6).map(day => ({
        day: convertToDay(day.dt, offset),
        avgTemp: Math.round(day.temp.day),
        minTemp: Math.round(day.temp.min),
        maxTemp: Math.round(day.temp.max),
        icon: day.weather[0].icon,
        description: day.weather[0].description,
        summary: day.summary,
        sunrise: convertToTime(day.sunrise, offset),
        sunset: convertToTime(day.sunset, offset),
    }));
};

export default mapDailyData;
