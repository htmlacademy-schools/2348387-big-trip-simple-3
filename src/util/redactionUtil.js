import { POINT_TYPES } from '../mock/const.js';
import { destinationsStorage } from '../mock/mock.js';
import { getFormattedDate, validateNumber } from '../util/utils.js';

const wrapPointTypes = (id) => POINT_TYPES.map((pointType) => `
  <div class="event__type-item">
    <input id="event-type-taxi-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}">
    <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${id}">${pointType.charAt(0).toUpperCase()}${pointType.slice(1)}</label>
  </div>`).join('');


const makePointIconSample = (id, type) => (`
    <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
      <span class="visually-hidden">Choose event type</span>
      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
    </label>
    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">`
);

const makePointTypeListSample = (id) => (`
  <div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>
    ${wrapPointTypes(id)}
  </fieldset>
  </div>
`);

const makeDestinationListSample = () => destinationsStorage.map((destination) => (`<option value="${destination.name}"></option>`)).join('');

const makePointDestinationSample = (id, type, destination) => (`
  <div class="event__field-group  event__field-group--destination">
    <label class="event__label  event__type-output" for="event-destination-${id}">
      ${type}
    </label>
    <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination.name}" list="destination-list-${id}">
    <datalist id="destination-list-${id}">
      ${makeDestinationListSample()}
    </datalist>
  </div>
`);

const makePointTimeSample = (id, dateFrom, dateTo) => (`
  <div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-${id}}">From</label>
    <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${getFormattedDate(dateFrom, 'DD/MM/YY HH:mm')}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-${id}">To</label>
    <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${getFormattedDate(dateTo, 'DD/MM/YY HH:mm')}">
  </div>
`);

const makePointPriceSample = (id, price) => (`
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${id}">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${validateNumber(price)}">
  </div>
`);

const wrapOffers = (stateOffers) => {
  const markup = [];
  for (const offer of stateOffers) {
    markup.push(`
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}" ${offer.isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>
  `);
  }
  return markup.join('');
};

const makePointOffersSample = (stateOffers) => (`
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${wrapOffers(stateOffers)}
    </div>
  </section>
`);

const getDestinationPicturesMarkup = (destination) => destination.pictures.map((pic) => `
  <img class="event__photo" src="${pic.src}.jpg" alt="${pic.description}">
`);

const makePointDestDetailsSample = (destination) => (`
  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${getDestinationPicturesMarkup(destination)}
      </div>
    </div>
  </section>
`);

const makePointEditSample = (data) => {
  const dataDestination = destinationsStorage[data.destination];
  const pointIconSample = makePointIconSample(data.id, data.type);
  const pointTypeListSample = makePointTypeListSample(data.id);
  const pointDestinationSample = makePointDestinationSample(data.id, data.type, dataDestination);
  const pointTimeSample = makePointTimeSample(data.id, data.date_from, data.date_to);
  const pointPriceSample = makePointPriceSample(data.id, data.base_price);
  const pointOffersSample = makePointOffersSample(data.state_offers);
  const pointDestDetailsSample = makePointDestDetailsSample(dataDestination);

  return `
  <form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      ${pointIconSample}
      ${pointTypeListSample}
    </div>

    ${pointDestinationSample}
    ${pointTimeSample}
    ${pointPriceSample}

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    ${pointOffersSample}
    ${pointDestDetailsSample}
  </section>
  </form>`;
};

export { makePointEditSample };
