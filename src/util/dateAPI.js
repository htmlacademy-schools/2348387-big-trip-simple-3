import dayjs from 'dayjs';
import {getRandInt} from './utils.js';


const getDates = () => {
  const start = getRandInt(1, 15);
  const end = getRandInt(16, 31);
  return [dayjs().add(start, 'd'), dayjs().add(end, 'd')];
};

const fullDate = (date) => date.format('YYYY-MM-DD HH:mm');

const getTime = (date) => date.format('HH:mm');

const getWithoutTime = (date) => date.format('YYYY-MM-DD');

const shortDate = (date) => date.format('MMM D');

const isPassed = (date) => date.isBefore(dayjs(), 'D') || date.isSame(dayjs(), 'D');

export {getDates, fullDate, getTime, getWithoutTime, shortDate, isPassed};
