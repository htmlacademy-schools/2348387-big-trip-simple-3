import AbstractView from '../framework/view/abstract-view.js';

const makeNoTaskSample = () => ('<p class="trip-events__msg">Loading...</p>');

class LoadingView extends AbstractView {
  get template() {
    return makeNoTaskSample();
  }
}

export default LoadingView;
