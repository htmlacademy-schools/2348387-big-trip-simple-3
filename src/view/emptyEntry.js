import { createElement } from '../render';

const makeEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

class EmptyEntryView {
  #element = null;

  get template() {
    return makeEmptyListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export default EmptyEntryView;
