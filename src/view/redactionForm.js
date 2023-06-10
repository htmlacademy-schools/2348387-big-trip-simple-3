import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { destinationsStorage, offersStorage } from '../mock/mock.js';
import { compareDates, getIdFromTag, turnModelDateToFramework } from '../util/utils.js';
import { makePointEditSample } from '../util/redactionUtil.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

class RedactionView extends AbstractStatefulView {
  _state = null;
  #datepickers = [];

  constructor(point) {
    super();
    this._state = RedactionView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#setDatepickers();
  }

  get template() {
    return makePointEditSample(this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickers) {
      this.#datepickers.forEach((dp) => dp.destroy());
      this.#datepickers = [];
    }
  };

  reset = (point) => {
    this.updateElement(RedactionView.parsePointToState(point));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDatepickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
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
    const index = RedactionView.getDestinationId(destination);
    if (index !== -1) {
      this.updateElement({
        'destination': index,
      });
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(RedactionView.parseStateToPoint(this._state));
  };

  setFormResetHandler = (callback) => {
    this._callback.formReset = callback;
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formResetHandler);
  };

  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formReset();
  };

  static parsePointToState = (point) => {
    const offs = [];
    for (const off of Object.values(offersStorage)) {
      offs.push({...off, 'isChecked': point.offers.includes(off.id)});
    }
    return {...point, 'state_offers': offs};
  };

  static parseStateToPoint = (state) => {
    const point = {...state};
    const noffers = [];
    point.state_offers.map((stoff) => {
      if (stoff.isChecked) {
        noffers.push(stoff.id);
      }
    });
    point.offers = noffers;
    delete point.state_offers;
    return point;
  };

  static getDestinationId = (destinationName) => destinationsStorage.map((current) => current.name).indexOf(destinationName);
}

export default RedactionView;
