import {fromUnixTime, format, addSeconds} from 'date-fns';

const convertToDay = (timeStamp, offset) => {
    const date = fromUnixTime(timeStamp);
    const adjustedDate = addSeconds(date, offset);
    return format(adjustedDate, 'EEEE');
};

export default convertToDay;
