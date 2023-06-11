import { getRandomInt, getMockText, getFormattedDate, sort, filter } from '../util/utils.js';
import { POINT_TYPES } from './const.js';
import dayjs from 'dayjs';

const generatePictures = () => {
  const res = new Array(getRandomInt(5));
  for (let i = 0; i < res.length; i++) {
    res[i] = {
      'src': `http://picsum.photos/300/200?r=${getRandomInt(Number.MAX_SAFE_INTEGER)}`,
      'description': getMockText(getRandomInt(50)),
    };
  }
  return res;
};

const mockDestinationNamesList = ['Amsterdam', 'Geneva', 'Chamonix'];
const destinationsStorage = [];
for (let i = 0; i < mockDestinationNamesList.length; i++) {
  destinationsStorage[i] = {
    'id': i,
    'description': getMockText(getRandomInt(200)),
    'name': mockDestinationNamesList[i],
    'pictures': generatePictures(),
  };
}

const numOfOffers = getRandomInt(7);
const offersStorage = {};
for (let i = 0; i < numOfOffers; i++) {
  offersStorage[i] = {
    'id': i,
    'title': `Offer #${i}`,
    'price': getRandomInt(100)
  };
}

const generateOffers = () => {
  const res = new Set();
  for (let i = 0; i < numOfOffers; i++) {
    if (getRandomInt() > 50) {
      res.add(i);
    }
  }
  return Array.from(res);
};

const generateType = () => POINT_TYPES[getRandomInt(POINT_TYPES.length)];

const generateDate = () => {
  const dateFrom = dayjs();
  const dateTo = dateFrom.add(getRandomInt(24), 'hour');
  return {
    'date_from': getFormattedDate(dateFrom),
    'date_to': getFormattedDate(dateTo),
  };
};

const generatePoint = (id) => {
  const dates = generateDate();
  return {
    'id': id,
    'type': generateType(),
    'base_price': getRandomInt(1000),
    'date_from': dates.date_from,
    'date_to': dates.date_to,
    'destination': getRandomInt(Object.keys(destinationsStorage).length),
    'offers': generateOffers()
  };
};

const generatePoints = (numOfPoints) => {
  const res = [];
  for (let i = 0; i < numOfPoints; i++) {
    res.push(generatePoint(i));
  }
  return res;
};

const getDefaultPoint = () => (Object.assign({}, {
  'id': 0,
  'type': POINT_TYPES[0],
  'base_price': 0,
  'date_from': dayjs(),
  'date_to': dayjs(),
  'destination': 0,
  'offers': [],
}));

const generateSort = (points) => Object.entries(sort).map(([sortName, sortPoints]) => ({
  name: sortName,
  count: sortPoints(points).length
}));

const generateFilter = (points) => Object.entries(filter).map(([filterName, filterPoints]) => ({
  name: filterName,
  count: filterPoints(points).length,
}));

export {destinationsStorage, offersStorage};
export {generatePoints, getDefaultPoint, generateSort, generateFilter};
