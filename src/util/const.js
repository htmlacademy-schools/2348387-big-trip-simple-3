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

const SortType = { //МЯЯЯУ?
  DAY: 'day',
  PRICE: 'price',
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export {FilterType, SortType, UserAction, UpdateAction, TimeLimit};
