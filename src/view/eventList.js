import { createElement } from '../render.js';


class TripEventsView {
  getTemplate = () => (
    `<ul class="trip-events__list">
    </ul>`
  );

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

export default TripEventsView;
