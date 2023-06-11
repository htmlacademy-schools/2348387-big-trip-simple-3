import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import TripModel from '../model/tripModel.js';
import { compareDates, getIdFromTag, turnModelDateToFramework } from '../util/utils.js';
import { makePointEditSample } from '../util/redactionUtil.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

class RedactionView extends AbstractStatefulView {
  _state = null;
  #datepickers = [];
  #availableOffers = [];
  #availableDestinations = [];

  constructor(point = TripModel.defaultPoint(), availableOffers = [], availableDestinations = []) {
    super();
    this._state = RedactionView.parsePointToState(point, availableOffers);
    this.#availableOffers = availableOffers;
    this.#availableDestinations = availableDestinations;

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return makePointEditSample(this._state, this.#availableDestinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickers) {
      this.#datepickers.forEach((dp) => dp.destroy());
      this.#datepickers = [];
    }
  };

  reset = (point, availableOffers) => {
    this.updateElement(RedactionView.parsePointToState(point, availableOffers));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setFormResetHandler(this._callback.formReset);
  };

  #setInnerHandlers = () => {
    for (const offer of this._state.state_offers) {
      this.element.querySelector(`#event-offer-${offer.id}`)
        .addEventListener('click', this.#offersHandler);
    }
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceHandler);
    this.element.querySelectorAll('.event__type-item')
      .forEach(
        (item) => item.addEventListener('click', this.#typeHandler)
      );
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#destinationHandler);
  };

  #dateFromChangeHandler = ([ndate]) =>{
    this.updateElement({
      'date_from': ndate,
    });
  };

  #dateToChangeHandler = ([ndate]) =>{
    this.updateElement({
      'date_to': ndate,
    });
  };

  #isBeforeDateFrom = (date) => compareDates(date, this._state.date_from);

  #setDatepickers = () => {
    this.#datepickers = [
      flatpickr(
        this.element.querySelectorAll('.event__input--time')[0],
        {
          enableTime: true,
          'time_24hr': true,
          dateFormat: 'd/m/y H:i',
          defaultDate: turnModelDateToFramework(this._state.date_from),
          onChange: this.#dateFromChangeHandler,
        },
      ),
      flatpickr(
        this.element.querySelectorAll('.event__input--time')[1],
        {
          enableTime: true,
          'time_24hr': true,
          dateFormat: 'd/m/y H:i',
          defaultDate: turnModelDateToFramework(this._state.date_to),
          onChange: this.#dateToChangeHandler,
          'disable': [this.#isBeforeDateFrom],
        },
      )];
  };


  #offersHandler = (evt) => {
    evt.preventDefault();
    const clickedOfferId = getIdFromTag(evt.target);
    const stateOffers = this._state.state_offers;
    for (const offer of stateOffers) {
      if (offer.id === clickedOfferId) {
        offer.isChecked = !offer.isChecked;
        break;
      }
    }
    this.updateElement({
      'state_offers': stateOffers,
    });
  };

  #priceHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      'base_price': evt.target.value,
    });
  };

  #typeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      'type': evt.target.textContent.toLowerCase(),
    });
  };

  #destinationHandler = (evt) => {
    evt.preventDefault();
    const destination = evt.target.value;
    const index = RedactionView.getDestinationId(destination, this.#availableDestinations);
    if (index !== -1) {
      this.updateElement({
        'destination': index,
      });
    }
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(RedactionView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(RedactionView.parseStateToPoint(this._state));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formResetHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
  };

  static parsePointToState = (point, availableOffers) => {
    const offs = [];
    for (const off of availableOffers) {
      offs.push({...off, 'isChecked': point.offers.includes(off.id)});
    }
    return {...point, 'state_offers': offs};
  };

  static parseStateToPoint = (state) => {
    const point = {...state};
    const noffers = point.state_offers.filter((stoff) => stoff.isChecked);
    point.offers = noffers;
    delete point.state_offers;
    return point;
  };

  static getDestinationId = (destinationName, availableDestinations) => availableDestinations.map((current) => current.name).indexOf(destinationName) + 1;
}

export default RedactionView;
