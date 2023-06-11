import AbstractView from '../framework/view/abstract-view.js';

const makeTripPointsListSample = () => `
  <ul class="trip-events__list"></ul>
`;
class PointListView extends AbstractView {
  get template() {
    return makeTripPointsListSample();
  }
}


export default PointListView;
