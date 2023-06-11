import AbstractView from '../framework/view/abstract-view.js';
import { makeEmptyListSample } from '../util/utils.js';

class EmptyListView extends AbstractView {
  #activeFilter = null;
  #isError = null;

  constructor(filter, isError) {
    super();
    this.#activeFilter = filter;
    this.#isError = isError;
  }

  get template() {
    return makeEmptyListSample(this.#activeFilter, this.#isError);
  }
}

export default EmptyListView;
