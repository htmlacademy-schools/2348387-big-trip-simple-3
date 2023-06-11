import { getFullDataTime } from './utils.js';
import 'flatpickr/dist/flatpickr.min.css';

const makeDestinationSample = (destinationId, availableDestinationSet) => {
  const {description, pictures} = availableDestinationSet[destinationId - 1];

  const picturesSection = pictures.map(({src: source, description: photoDescription}) => `<img class="event__photo" src="${source}" alt="${photoDescription}">`)
    .join('');

  if (destinationId) {
    return `
    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${picturesSection}
          </div>
        </div>
      </section>`;
  }
  return '';
};

const makeOffersSample = (type, offers, availableOffers) => {
  const template = Object.values(availableOffers)
    .map(({ type: pointType, offers: typeOffers }) => {
      if (type === pointType) {
        return typeOffers.map(({ id, title, price }) => {
          const isChecked = offers.includes(id) ? 'checked' : '';
          return `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="${id}" type="checkbox" name="${title}" ${isChecked}>
              <label class="event__offer-label" for="${id}">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>
          `;
        }).join('');
      }
      return [];
    }).join('');

  return template
    ? `
      <section class="event__section event__section--offers">
        <h3 class="event__section-title event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${template}
        </div>
      </section>
      `
    : '';
};

const makeTypeImageSample = (currentType, availableOffers) => Object.values(availableOffers)
  .map(({type}) => {
    const checkedValue = type === currentType ? 'checked' : '';
    return `
      <div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${checkedValue}>
        <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>
    `;
  }).join('');

const makeDestinationListSample = (availableDestinations) => Object.values(availableDestinations)
  .map((destination) => `<option value="${destination.name}"></option>`).join('');

const makePointEditorSample = (data, isPointNew, availableDestinations, availableOffers) => {
  const {dateFrom, dateTo, offers, type, destination, basePrice, isDestination, isDeleting, isSaving} = data;

  const tripDateFrom = dateFrom !== null
    ? getFullDataTime(dateFrom)
    : 'No data';

  const tripDateTo = dateTo !== null
    ? getFullDataTime(dateTo)
    : 'No data';

  const destinationName = isDestination
    ? availableDestinations[destination - 1].name
    : '';

  const destinationTemplate = isDestination
    ? makeDestinationSample(destination, availableDestinations)
    : '';

  const offersTemplate = makeOffersSample(type, offers, availableOffers);

  const isDisabled = (isDeleting || isSaving);

  const buttonsTemplate = isPointNew
    ? `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>${isDeleting ? 'Cancelling...' : 'Cancel'}</button>`
    : `
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSaving ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
      <button class="event__reset-btn" type="reset" ${isDeleting ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;

  return `
<li class="trip-events__item" ${isDisabled ? 'style="pointer-events: none;"' : ''}>
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${makeTypeImageSample(type, availableOffers)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${makeDestinationListSample(availableDestinations)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${tripDateFrom}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${tripDateTo}"">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" pattern="[0-9]*">
      </div>

      ${buttonsTemplate}
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>
  </form>
</li>
`;
};

export {makePointEditorSample};

