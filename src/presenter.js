import PointView from './view/routinePoint.js';
import RedactionView from './view/redactionForm.js';
import CreationFormView from './view/creation.js';
import SortingView from './view/sort.js';
import TripEventsView from './view/eventList.js';
import {render} from './render.js';

class Presenter {

  pointsList = new TripEventsView();

  constructor(container, tripModel) {
    this.container = container;
    this.tripModel = tripModel;
  }

  init() {

    this.routePoints = this.tripModel.getPoints();

    render(new SortingView(), this.container);
    render(this.pointsList, this.container);
    render(new RedactionView(this.routePoints[0]), this.pointsList.getElement());
    render(new CreationFormView(this.routePoints[0]), this.pointsList.getElement());

    for (let i = 1; i < 5; i++) {
      render(new PointView(this.routePoints[i]), this.pointsList.getElement());
    }

  }

}

export default Presenter;
