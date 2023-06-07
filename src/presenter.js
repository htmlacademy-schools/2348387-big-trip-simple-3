import PointView from './view/routinePoint.js';
import RedactionView from './view/redactionForm.js';
import CreationFormView from './view/creation.js';
import SortingView from './view/sort.js';
import TripEventsView from './view/eventList.js';
import {render} from './render.js';

export default class Presenter {

  pointsList = new TripEventsView();

  constructor({container}) {
    this.container = container;
  }

  init() {

    render(new SortingView(), this.container);
    render(this.pointsList, this.container);
    render(new RedactionView(), this.pointsList.getElement());
    render(new CreationFormView(), this.pointsList.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsList.getElement());
    }

  }

}
