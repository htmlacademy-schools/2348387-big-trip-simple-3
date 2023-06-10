import AbstractView from '../framework/view/abstract-view';

const makeEmptyListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

class EmptyEntryView extends AbstractView{

  get template() {
    return makeEmptyListTemplate();
  }
}

export default EmptyEntryView;
