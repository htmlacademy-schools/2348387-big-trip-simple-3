import { FilterType, SortType } from './const.js';
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

const makeEmptyListSample = (currentFilter, isError) => {
  if (!isError) {
    if (currentFilter === 'everything') {
      return '<p class="trip-events__msg">Click New Event to create your first point</p>';
    }
    return '<p class="trip-events__msg">There are no future events now</p>';
  }
  return '<p class="trip-events__msg">Something went wrong. Please try again later</p>';
};

const makeTripPointsListSample = () => `
  <ul class="trip-events__list"></ul>
`;

const makePointFiltersSample = (currentFilter, points) => {
  const futurePointsCount = filter['future'](points).length;
  return `
    <form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything"
        ${currentFilter === FilterType.EVERYTHING ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>
      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future"
        ${currentFilter === FilterType.FUTURE ? 'checked' : ''}
        ${futurePointsCount === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
};

const makeNoTaskSample = () => ('<p class="trip-events__msg">Loading...</p>');

const parsePointToState = (point) => ({...point,
  isDestination: point.destination !== null,
  isSaving: false,
  isDeleting: false,
});

const parseStateToPoint = (state) => {
  const point = {...state};
  if (!point.isDestination) {
    point.destination = null;
  }
  delete point.isDestination;
  delete point.isSaving;
  delete point.isDeleting;

  return point;
};

const makeOffersSample = (type, offers, availableOffers) => {
  const allOffers = Object.values(availableOffers);
  const template = allOffers
    .filter(({ type: pointType }) => type === pointType)
    .map(({ offers: typeOffers }) =>
      typeOffers
        .filter(({ id }) => offers.includes(id))
        .map(({ title, price }) => `
          <li class="event__offer">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>
        `).join('')
    )
    .join('');


  return template;
};

const makeTripPointSample = (tripInfo, availableDestinations, availableOffers) => {
  const {dateFrom, dateTo, offers, type, destination, basePrice} = tripInfo;

  const tripDate = dateFrom !== null
    ? getDate(dateFrom)
    : 'No data';

  const tripTimeFrom = dateFrom !== null
    ? getTime(dateFrom)
    : 'No time';

  const tripTimeTo = dateTo !== null
    ? getTime(dateTo)
    : 'No time';

  const destinationName = destination !== null
    ? availableDestinations[destination - 1].name
    : 'No destination';

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${tripDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${tripTimeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${tripTimeTo}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${makeOffersSample(type, offers, availableOffers)}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `;
};

const makePointListSortingSample = (currentSortType) => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" data-sort-type="${SortType.DAY}" ${currentSortType === SortType.DAY ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" disabled>
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}" ${currentSortType === SortType.PRICE ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>
  `;


export { filter };
export { isFormValid, isDatesEqual, sortDays, sortPrices, getDate, getTime, getFullDataTime,
  makeEmptyListSample, makeTripPointsListSample, makePointFiltersSample, makeNoTaskSample,
  parsePointToState, parseStateToPoint, makeTripPointSample, makePointListSortingSample};
