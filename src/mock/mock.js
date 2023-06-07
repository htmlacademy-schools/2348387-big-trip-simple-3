import { getRandInt } from '../utils.js';
import { getDates } from '../dateAPI.js';
import {TYPES, CITIES, getArrayFromType, DESCRIPTION} from './const.js';

let i = 0;
let pointId = 0;
const destinations = [];

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

export {getDestById, generatePoint};
