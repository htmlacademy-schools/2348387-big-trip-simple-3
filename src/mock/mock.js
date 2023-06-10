import { getRandInt } from '../util/utils.js';
import { getDates, isPassed } from '../util/dateAPI.js';
import {TYPES, CITIES, DESCRIPTION, getArrayFromType, FilterType, SortingType} from './const.js';

let i = 0;
let pointId = 0;
const destinations = [];

const filter = {
  [FilterType.ALL]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPassed(point.dateFrom))
};

const sort = {
  [SortingType.DAY]: (points) => points,
  [SortingType.EVENT]: (points) => points,
  [SortingType.TIME]: (points) => points,
  [SortingType.PRICE]: (points) => points,
  [SortingType.OFFERS]: (points) => points,
};

const destinationFactory = () => {
  const res = {
    id: ++i,
    name: CITIES[getRandInt(0, CITIES.length - 1)],
    description: DESCRIPTION[getRandInt(0, DESCRIPTION.length - 1)],
    pictures: [
      {
        src: `http://picsum.photos/248/152?r=${getRandInt(1, 100)}`,
        description: 'placeholder'
      }
    ]
  };
  destinations.push(res);
  return res;
};

const getDestById = (id) => destinations.find((dest) => dest.id === id);

const generatePoint = () => {
  const pointType = TYPES[getRandInt(1, TYPES.length - 1)];
  const dates = getDates();
  const offersForType = getArrayFromType(pointType);
  const dest = destinationFactory();
  return {
    id: ++pointId,
    type: pointType,
    destination: dest.id,
    dateFrom: dates[0],
    dateTo: dates[1],
    price: getRandInt(1, 1500),
    offers: offersForType.slice(getRandInt(0, offersForType.length - 1))
  };
};

const generateFilter = (points) => Object.entries(filter).map(([filterName, filterPoints]) => ({
  name: filterName,
  count: filterPoints(points).length,
}));

const generateSort = (points) => Object.entries(sort).map(([sortName, sortPoints]) => ({
  name: sortName,
  count: sortPoints(points).length
}));

export {getDestById, generatePoint, generateFilter, generateSort};
