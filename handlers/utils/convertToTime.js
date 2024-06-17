import {fromUnixTime, format, addSeconds} from 'date-fns';

const convertToTime = (timeStamp, offset) => {
    const date = fromUnixTime(timeStamp);
    const adjustedDate = addSeconds(date, offset);
    return format(adjustedDate, 'h:mm a');
};

export default convertToTime;
