import { createElement } from '../render.js';

const tripEventsTemplateFactory = () => (
  `<ul class="trip-events__list">
  </ul>`
);

class TripEventsView {
  getTemplate () {
    return tripEventsTemplateFactory;
  }

  getElement() {
    if (!this.element){
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export default {TripEventsView};
