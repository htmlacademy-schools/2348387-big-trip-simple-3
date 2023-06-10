import AbstractView from '../framework/view/abstract-view.js';


class TripEventsView extends AbstractView{

  get template () {
    return `<ul class="trip-events__list">
    </ul>`;
  }
}

export default TripEventsView;
