import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils.js';
import { SortingType } from '../mock/const.js';

const makeItemTemplate = (sort, status) => `
<div class="trip-sort__item  trip-sort__item--${sort}">
<input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}" ${status}>
<label class="trip-sort__btn" for="sort-${sort}">${capitalize(sort)}</label>
</div>`;

const makeSortingTemplateFacture = (activeSort) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${makeItemTemplate(SortingType.DAY, activeSort === SortingType.DAY ? 'checked' : '')}
  ${makeItemTemplate(SortingType.EVENT, 'disabled')}
  ${makeItemTemplate(SortingType.TIME, 'disabled')}
  ${makeItemTemplate(SortingType.PRICE, activeSort === SortingType.PRICE ? 'checked' : '')}
  ${makeItemTemplate(SortingType.OFFERS, 'disabled')}
  </form>`
);

class SortingView extends AbstractView{
  #activeSort = SortingType.DAY;

  get template() {
    return makeSortingTemplateFacture(this.#activeSort);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this.#activeSort = evt.target.outerText.toLowerCase();
    this._callback.sortTypeChange(evt.target.outerText.toLowerCase());
  };
}

export default SortingView;
