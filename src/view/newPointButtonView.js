import AbstractView from '../framework/view/abstract-view.js';

const makeNewPointButtonSample = () => '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

class NewPointButtonView extends AbstractView {
  get template() {
    return makeNewPointButtonSample();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

export default NewPointButtonView;
