import { createElement } from '../render.js';


class TripEventsView {
  #element = null;

  get template () {
    return `<ul class="trip-events__list">
    </ul>`;
  }

  get element() {
    if (!this.#element){
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export default TripEventsView;
