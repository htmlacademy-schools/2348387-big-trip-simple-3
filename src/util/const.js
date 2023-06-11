const AUTHORIZATION = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};


const UpdateAction = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
};

const SortType = {
  DAY: 'day',
  PRICE: 'price',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const POINT_TEMPLATE = {
  type: 'flight',
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: '',
  offers: new Array(),
  destination: null,
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export { AUTHORIZATION, END_POINT, POINT_TEMPLATE };
export { FilterType, SortType, UserAction, UpdateAction, TimeLimit, Mode };
