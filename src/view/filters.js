import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../mock/const.js';
import { filter } from '../util/utils.js';

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

class FilterView extends AbstractView {
  #currentFilter = null;
  #points = null;

  constructor(currentFilterType, points) {
    super();
    this.#currentFilter = currentFilterType;
    this.#points = points;
  }

  get template() {
    return makePointFiltersSample(this.#currentFilter, this.#points);
  }

  get selectedFilter() {
    return this.#currentFilter;
  }

  setFilterChangeHandler = (callback) => {
    this._callback.chageFilter = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.chageFilter(evt.target.value);
  };
}

export default FilterView;
