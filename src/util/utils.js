import dayjs from 'dayjs';
import { SortType, FilterType, MODEL_DATE_FORMAT } from '../mock/const.js';

const getRandomInt = (upperBound = 100) => (Math.floor(Math.random() * upperBound));

const getFormattedDate = (eventDate = dayjs(), format = MODEL_DATE_FORMAT) => dayjs(eventDate).format(format);

const isEventUpcoming = (date) => !dayjs(date).isBefore(dayjs(), 'day');

const turnModelDateToFramework = (date) => dayjs(date).format('DD/MM/YY HH:mm');

const compareDates = (a, b) => dayjs(a).diff(dayjs(b)) < 0;

const getIdFromTag = (tag) => +tag.id.split('-').slice(-1);

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

const validateNumber = (num) => {
  if (isNaN(num)) {
    return 0;
  } else if (num >= 0) {
    return num;
  }
  return -num;
};

const getAvailableOffers = (type, offers) => {
  for (const category of offers) {
    if (category.type === type) {
      return category.offers;
    }
  }
};

const generateAuthorizationKey = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const getListElementsNamesList = (availableDestinations) =>
  availableDestinations.map((element) => element.name);

const getListElementId = (destinationName, availableDestinations) =>
  getListElementsNamesList(availableDestinations)
    .indexOf(destinationName) + 1;

const defaultPoint = () => Object.assign({}, {
  'id': 0,
  'type': 'taxi',
  'base_price': 0,
  'date_from': getFormattedDate(),
  'date_to': getFormattedDate(),
  'destination': 1,
  'offers': [],
});

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

export {filter, sort};
export {getRandomInt, getFormattedDate, isEventUpcoming, getMockText, validateNumber, sortPointsByDay, sortPointsByPrice,
  getIdFromTag, turnModelDateToFramework, compareDates, getAvailableOffers, generateAuthorizationKey, getListElementsNamesList, getListElementId, defaultPoint};
