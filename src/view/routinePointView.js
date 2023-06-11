import AbstractView from '../framework/view/abstract-view.js';
import { makeTripPointSample } from '../util/utils.js';

class PointView extends AbstractView {
  #point = null;

  #availableDestinationSet;
  #availableOffersSet;

  constructor(destinations, offers, point) {
    super();
    this.#availableDestinationSet = destinations;
    this.#availableOffersSet = offers;

    this.#point = point;
  }

  get template() {
    return makeTripPointSample(this.#point, this.#availableDestinationSet, this.#availableOffersSet);
  }

  setEditClickHandler = (callback) => {
    this._callback.openEditor = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openEditor();
  };
}

export default PointView;
