import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import { makePointEditorSample } from '../util/redactionUtil.js';
import { POINT_TEMPLATE } from '../util/const.js';
import { isFormValid, parsePointToState, parseStateToPoint } from '../util/utils.js';

class RedactionView extends AbstractStatefulView {
  #availableDestinationSet;
  #availableOffersSet;
  #isNewPoint;
  _currnentState;

  #datepickerSet = {};

  constructor(destinations, offers, point = POINT_TEMPLATE) {
    super();
    this.#availableDestinationSet = destinations;
    this.#availableOffersSet = offers;
    this.#isNewPoint = (point === POINT_TEMPLATE);
    this._currnentState = parsePointToState(point);

    this.#setHandlers();
    this.#setDateEndPicker();
    this.#setDateStartPicker();
  }

  get template() {
    return makePointEditorSample(this._currnentState, this.#isNewPoint, this.#availableDestinationSet, this.#availableOffersSet);
  }

  #setHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#changeType);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#changeDestination);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#changePrice);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#changeOffers);
  };

  #changeDateEnd = ([userDate]) => {
    this._setState({ dateTo: userDate });
  };

  #setDateEndPicker = () => {
    const dateToPickr = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._currnentState.dateTo,
        onChange: this.#changeDateEnd,
      },
    );
    this.#datepickerSet.dateTo = dateToPickr;
  };

  #changeDateStart = ([userDate]) => {
    this._setState({ dateFrom: userDate });
  };

  #setDateStartPicker = () => {
    const dateFromPickr = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._currnentState.dateFrom,
        onChange: this.#changeDateStart,
      },
    );
    this.#datepickerSet.dateFrom = dateFromPickr;
  };

  #changeType = (evt) => {
    evt.preventDefault();
    const fieldset = this.element.querySelector('.event__type-list');
    const newType = fieldset.querySelector('input:checked').value;
    this.updateElement({
      type: newType,
      offers: new Array(),
    });
  };

  #changePrice = (evt) => {
    evt.preventDefault();
    const newPrice = Number(evt.target.value);
    this._setState({ basePrice: newPrice });
  };

  #changeOffers = (evt) => {
    evt.preventDefault();
    const offersField = this.element.querySelector('.event__available-offers');
    const checkboxes = offersField.querySelectorAll('.event__offer-checkbox:checked');
    const checkedIds = new Array();
    checkboxes.forEach((checkbox) => { checkedIds.push(Number(checkbox.id)); });
    this._setState({ offers: checkedIds });
  };

  #changeDestination = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const destinationToAdd = Object.values(this.#availableDestinationSet).find(({name}) => destinationName === name);

    if (destinationToAdd) {
      this.updateElement({destination: destinationToAdd.id, isDestination: true });
    } else {
      this._setState({destination: null, isDestination: false });
    }
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeForm();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const newState = parseStateToPoint(this._currnentState);
    if (isFormValid(newState, this.#availableDestinationSet)) {
      this._callback.formSubmit(newState);
    }
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(parseStateToPoint(this._currnentState));
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._callback.escClose();
    }
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#closeButtonClickHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  };

  setEscKeydownHandler = (callback) => {
    this._callback.escClose = callback;
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  removeEscKeydownHandler = () => {
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  reset = (point) => {
    this.updateElement(parsePointToState(point),);
  };

  removeElement = () => {
    super.removeElement();
    this.removeEscKeydownHandler();

    if (this.#datepickerSet.dateTo) {
      this.#datepickerSet.dateTo.destroy();
      this.#datepickerSet.dateTo = null;

      this.#datepickerSet.dateFrom.destroy();
      this.#datepickerSet.dateFrom = null;
    }
  };

  _restoreHandlers = () => {
    this.#setHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseButtonClickHandler(this._callback.closeForm);
    this.setDeleteButtonClickHandler(this._callback.delete);

    this.#setDateEndPicker();
    this.#setDateStartPicker();
  };
}

export default RedactionView;
