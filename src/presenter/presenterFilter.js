import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filtersView.js';
import {FilterType, UpdateAction} from '../util/const.js';
import {filter} from '../util/utils.js';

class FilterPresenter {
  #containerFilter;
  #modelFilter;
  #points;
  #component = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#containerFilter = filterContainer;
    this.#modelFilter = filterModel;
    this.#points = pointsModel;

    this.#modelFilter.addObserver(this.#handleEvent);
    this.#points.addObserver(this.#handleEvent);
  }

  get filters() {
    const points = this.#points.points;
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'EVERYTHING',
        count: filter[FilterType.EVERYTHING](points).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'FUTURE',
        count: filter[FilterType.FUTURE](points).length,
      },
    ];
  }

  initialize = () => {
    const previousComponent = this.#component;

    this.#component = new FilterView(this.#modelFilter.filter, this.#points.points);
    this.#component.setFilterChangeHandler(this.#handleFilterTypeChange);

    if (previousComponent === null) {
      render(this.#component, this.#containerFilter);
      return;
    }

    replace(this.#component, previousComponent);
    remove(previousComponent);
  };

  #handleEvent = () => {
    this.initialize();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#modelFilter.filter === filterType) {
      return;
    }

    this.#modelFilter.setFilter(UpdateAction.MAJOR, filterType);
  };
}

export default FilterPresenter;
