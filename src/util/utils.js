import { FilterType } from './const.js';
import dayjs from 'dayjs';

const getDate = (date) => dayjs(date).format('MMM D');

const getTime = (date) => dayjs(date).format('HH-mm');

const getFullDataTime = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'm');

const isDateFuture = (date) => {
  const currentDate = dayjs();
  const targetDate = dayjs(date);
  return targetDate.isAfter(currentDate, 'm');
};

const isFormValid = (state, availableDestinations) => {
  const allIds = Object.keys(availableDestinations);

  return (allIds.includes(`${state.destination - 1}`) && /^\d+$/.test(state.basePrice));
};

const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

const sortDays = (pointA, pointB) => {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
};

const sortPrices = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isDateFuture(point.dateTo)),
};

export { filter, isFormValid, isDatesEqual, sortDays, sortPrices, getDate, getTime, getFullDataTime };
