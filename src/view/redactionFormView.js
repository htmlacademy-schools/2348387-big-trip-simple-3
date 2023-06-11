import { isFormValid } from '../util/utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import { POINT_TEMPLATE, makePointEditorSample } from '../util/redactionUtil.js';


class RedactionView extends AbstractStatefulView {
  #datepicker = {};
  #isPointNew = false;
  _state = null;

  #availableDestinations = null;
  #availableOffers = null;

  constructor(destinations, offers, point = POINT_TEMPLATE) {
    super();

    this.#availableDestinations = destinations;
    this.#availableOffers = offers;

    this.#isPointNew = (point === POINT_TEMPLATE);
    this._state = RedactionView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#setDateToPicker();
    this.#setDateFromPicker();


  }

  static parsePointToState = (point) => ({...point,
    isDestination: point.destination !== null,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    if (!point.isDestination) {
      point.destination = null;
    }
    delete point.isDestination;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  };

  get template() {
    return makePointEditorSample(this._state, this.#isPointNew, this.#availableDestinations, this.#availableOffers);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#changeType);
    this.element.querySelector('.event__input--destination')
      .addEventListener('input', this.#changeDestination);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#changePrice);
    this.element.querySelector('.event__available-offers')
      ?.addEventListener('change', this.#changeOffers);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseButtonClickHandler(this._callback.closeForm);
    this.setDeleteButtonClickHandler(this._callback.delete);

    this.#setDateToPicker();
    this.#setDateFromPicker();
  };

  #changeDateTo = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  #setDateToPicker = () => {
    const dateToPickr = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#changeDateTo,
      },
    );
    this.#datepicker.dateTo = dateToPickr;
  };

  #changeDateFrom = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #setDateFromPicker = () => {
    const dateFromPickr = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'Y/m/d H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#changeDateFrom,
      },
    );
    this.#datepicker.dateFrom = dateFromPickr;
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
    this._setState({
      basePrice: newPrice,
    });
  };

  #changeOffers = (evt) => {
    evt.preventDefault();
    const offersField = this.element.querySelector('.event__available-offers');
    const checkboxes = offersField.querySelectorAll('.event__offer-checkbox:checked');

    const checkedIds = new Array();

    checkboxes.forEach((checkbox) => {
      checkedIds.push(Number(checkbox.id));
    });

    this._setState({
      offers: checkedIds,
    });
  };

  #changeDestination = (evt) => {
    evt.preventDefault();
    const newDestinationName = evt.target.value;
    const destination = Object.values(this.#availableDestinations).find(({name}) => newDestinationName === name);

    if (destination) {
      this.updateElement({
        destination: destination.id,
        isDestination: true,
      });
    } else {
      this._setState({
        destination: null,
        isDestination: false,
      });
    }

  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeForm = callback;
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#closeButtonClickHandler);
  };

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeForm();
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const newState = RedactionView.parseStateToPoint(this._state);
    if (isFormValid(newState, this.#availableDestinations)) {
      this._callback.formSubmit(newState);
    }
  };

  setDeleteButtonClickHandler = (callback) => {
    this._callback.delete = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  };

  #deleteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.delete(RedactionView.parseStateToPoint(this._state));
  };

  setEscKeydownHandler = (callback) => {
    this._callback.escClose = callback;
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #escKeydownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._callback.escClose();
    }
  };

  removeEscKeydownHandler = () => {
    document.removeEventListener('keydown', this.#escKeydownHandler);
  };

  reset = (point) => {
    this.updateElement(
      RedactionView.parsePointToState(point),
    );
  };

  removeElement = () => {
    super.removeElement();
    this.removeEscKeydownHandler();

    if (this.#datepicker.dateTo) {
      this.#datepicker.dateTo.destroy();
      this.#datepicker.dateTo = null;

      this.#datepicker.dateFrom.destroy();
      this.#datepicker.dateFrom = null;
    }
  };
}

export default RedactionView;
