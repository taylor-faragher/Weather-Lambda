import mapHourlyData from './mapHourlyData.js';
import mapDailyData from './mapDailyData.js';
import mapCurrentData from './mapCurrentData.js';

const mapWeatherData = async (data, city = 'Washington') => {
    if (!data) {
        return;
    }
    const mappedHourlyData = await mapHourlyData(data.hourly, data.timezone_offset);
    const mappedDailyData = await mapDailyData(data.daily, data.timezone_offset);
    const mappedCurrentData = await mapCurrentData(data);

    const mappedData = {
        coordinates: {
            lon: data.lon,
            lat: data.lat,
        },
        current: mappedCurrentData,
        hourly: mappedHourlyData,
        daily: mappedDailyData,
        area: {
            timezone: data.timezone,
            majorCity: city,
        },
    };

    return mappedData;
};

export default mapWeatherData;
