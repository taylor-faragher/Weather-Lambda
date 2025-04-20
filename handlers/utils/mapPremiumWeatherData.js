import mapHourlyData from './mapHourlyData.js';
import mapDailyData from './mapDailyData.js';
import mapCurrentData from './mapCurrentData.js';
import logger from './logger';

const mapPremiumWeatherData = async (data, city = 'Washington') => {
    if (!data) {
        logger.error('No data received for mapping');
        throw new Error('No data received for mapping');
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

export default mapPremiumWeatherData;
