import AbstractView from '../framework/view/abstract-view.js';

const tempMsgConst = 'Click New Event to create your first point';

const createEmptyListMessageTemplate = (msg) =>
  `<p class="trip-events__msg">${msg}</p>`;

class EmptyListView extends AbstractView {
  get template() {
    return createEmptyListMessageTemplate(tempMsgConst);
  }
}
export default EmptyListView;
