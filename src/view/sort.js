import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../mock/const.js';

const makeSortItemSample = (sortName, sortStatus) => `
  <div class="trip-sort__item  trip-sort__item--${sortName}">
    <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortName}" ${sortStatus}>
    <label class="trip-sort__btn" for="sort-${sortName}" data-sort-type="${sortName}">${sortName}</label>
  </div>
`;

const makeSortSample = (currentSort) => `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${makeSortItemSample(SortType.DAY, currentSort === SortType.DAY ? 'checked' : '')}
    ${makeSortItemSample(SortType.EVENT, 'disabled')}
    ${makeSortItemSample(SortType.TIME, 'disabled')}
    ${makeSortItemSample(SortType.PRICE, currentSort === SortType.PRICE ? 'checked' : '')}
    ${makeSortItemSample(SortType.OFFERS, 'disabled')}
  </form>
`;

class SortView extends AbstractView {
  #currentSort = SortType.DAY;

  get template() {
    return makeSortSample(this.#currentSort);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this.#currentSort = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };
}

export default SortView;
