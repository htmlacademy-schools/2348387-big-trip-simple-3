import dayjs from 'dayjs';
import { SortType, FilterType } from '../mock/const.js';

const getRandomInt = (upperBound = 100) => (Math.floor(Math.random() * upperBound));
const getFormattedDate = (eventDate, format) => dayjs(eventDate).format(format);
const isEventUpcoming = (date) => !dayjs(date).isBefore(dayjs(), 'D');
const getMockText = (len) => {
  const mockText = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
  cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
  est laborum.`;
  return mockText.slice(0, len);
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isEventUpcoming(point.date_from)),
};

const sort = {
  [SortType.DAY]: (points) => points,
  [SortType.EVENT]: (points) => points,
  [SortType.TIME]: (points) => points,
  [SortType.PRICE]: (points) => points,
  [SortType.OFFERS]: (points) => points,
};

const sortPointsByDay = (pa, pb) => dayjs(pa.date_from).toDate() - dayjs(pb.date_from).toDate();

const sortPointsByPrice = (pa, pb) => pb.base_price - pa.base_price;

const getIdFromTag = (tag) => +tag.id.split('-').slice(-1);

export {filter, sort};
export {getRandomInt, getFormattedDate, isEventUpcoming, getMockText, updateItem, sortPointsByDay, sortPointsByPrice, getIdFromTag};
