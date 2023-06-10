import AbstractView from '../framework/view/abstract-view.js';
import { getOfferName, getOfferPrice } from '../mock/const.js';
import { fullDate, getTime, getWithoutTime, shortDate } from '../util/dateAPI.js';
import { getDestById } from '../mock/mock.js';

const createOfferTemplate = (offerIds) => offerIds.map((id) => `<li class="event__offer">
  <span class="event__offer-title">${getOfferName(id)}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${getOfferPrice(id)}</span>
  </li>`).join('');

const pathPointFactory = (point) => {
  const destination = getDestById(point.destination);
  return `<li class="trip-events__item">
	<div class="event">
	  <time class="event__date" datetime="${getWithoutTime(point.dateFrom)}">${shortDate(point.dateFrom)}</time>
	  <div class="event__type">
		<img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
	  </div>
	  <h3 class="event__title">${point.type} ${destination.name}</h3>
	  <div class="event__schedule">
		<p class="event__time">
		  <time class="event__start-time" datetime="${fullDate(point.dateFrom)}">${getTime(point.dateFrom)}</time>
		  &mdash;
		  <time class="event__end-time" datetime="${fullDate(point.dateTo)}">${getTime(point.dateTo)}</time>
		</p>
		<p class="event__duration"> D H
	  M</p>
	  </div>
	  <p class="event__price">
		&euro;&nbsp;<span class="event__price-value">${point.price}</span>
	  </p>
	  <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${createOfferTemplate(point.offers)}
    </ul>
	  <button class="event__favorite-btn event__favorite-btn--active" type="button">
		<span class="visually-hidden">Add to favorite</span>
		<svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
		  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
		</svg>
	  </button>
	  <button class="event__rollup-btn" type="button">
		<span class="visually-hidden">Open event</span>
	  </button>
	</div>
  </li>`;};


class PointView extends AbstractView{

  constructor(point) {
    super();
    this.point = point;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  get template() {
    return pathPointFactory(this.point);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

export default PointView;
