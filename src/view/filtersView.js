import AbstractView from '../framework/view/abstract-view.js';
import { makePointFiltersSample } from '../util/utils.js';

class FilterView extends AbstractView {
  #activeFilter = null;
  #pointSet = null;

  constructor(currentFilterType, points) {
    super();
    this.#activeFilter = currentFilterType;
    this.#pointSet = points;
  }

  get template() {
    return makePointFiltersSample(this.#activeFilter, this.#pointSet);
  }

  get selectedFilter() {
    return this.#activeFilter;
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.chageFilter(evt.target.value);
  };

  setFilterChangeHandler = (callback) => {
    this._callback.chageFilter = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

}

export default FilterView;
