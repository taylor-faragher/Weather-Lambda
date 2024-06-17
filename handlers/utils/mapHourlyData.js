import convertToTime from './convertToTime';

const mapHourlyData = (hourlyData, offset) => {
    if (!hourlyData) {
        throw new Error('Missing Hourly Data');
    }
    return hourlyData.slice(1, 13).map(hour => ({
        time: convertToTime(hour.dt, offset),
        temp: Math.round(hour.temp),
        icon: hour.weather[0].icon,
        description: hour.weather[0].description,
    }));
};

export default mapHourlyData;
