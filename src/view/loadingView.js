import AbstractView from '../framework/view/abstract-view.js';
import { makeNoTaskSample } from '../util/utils.js';

class LoadingView extends AbstractView {
  get template() {
    return makeNoTaskSample();
  }
}

export default LoadingView;
