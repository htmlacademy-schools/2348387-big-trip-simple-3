import Observable from '../framework/observable.js';
import {FilterType} from '../util/const.js';

class FilterModel extends Observable {
  #activefilter = FilterType.EVERYTHING;

  get filter() {
    return this.#activefilter;
  }

  setFilter = (type, filter) => {
    this.#activefilter = filter;
    this._notify(type, filter);
  };
}

export default FilterModel;
