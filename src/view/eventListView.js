import AbstractView from '../framework/view/abstract-view.js';
import { makeTripPointsListSample } from '../util/utils.js';

class PointListView extends AbstractView {
  get template() {
    return makeTripPointsListSample();
  }
}

export default PointListView;
