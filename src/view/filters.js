import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../util/utils.js';

const makeFilterItem = (filter) => (
  `<div class="trip-filters__filter">
  <input id="filter-${filter.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name}">
  <label class="trip-filters__filter-label" for="filter-${filter.name}">${capitalize(filter.name)}</label>
  </div>`
);

const makeFiltersTemplateFactory = (filterItems) => (
  `<form class="trip-filters" action="#" method="get">
    ${filterItems.map((item) => makeFilterItem(item)).join('')}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
);

class FiltersView extends AbstractView{

  constructor(filters) {
    super();
    this.filters = filters;
  }

  get template () {
    return makeFiltersTemplateFactory(this.filters);
  }
}

export default FiltersView;
