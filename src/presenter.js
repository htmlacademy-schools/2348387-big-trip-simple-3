import PointView from './view/routinePoint.js';
import RedactionView from './view/redactionForm.js';
import SortingView from './view/sort.js';
import TripEventsView from './view/eventList.js';
import {render} from './render.js';


class Presenter {

  #pointsList = new TripEventsView();

  constructor(container, tripModel) {
    this.container = container;
    this.tripModel = tripModel;
  }

  #renderPoint(point) {
    const pointView = new PointView(point);
    const redactionView = new RedactionView(point);


    const replacePointWithForm = () => {
      this.#pointsList.element.replaceChild(redactionView.element, pointView.element);
    };

    const replaceFormWithPoint = () => {
      this.#pointsList.element.replaceChild(pointView.element, redactionView.element);
    };

    const closeFormOnEscape = (evt) => {
      if(evt.keyCode === 27) {
        evt.preventDefault();
        replaceFormWithPoint();
        document.removeEventListener('keydown', closeFormOnEscape);
      }
    };

    pointView.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replacePointWithForm();
      document.addEventListener('keydown', closeFormOnEscape);
    });

    redactionView.element.querySelector('.event__save-btn').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormWithPoint();
      document.removeEventListener('keydown', closeFormOnEscape);
    });

    redactionView.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceFormWithPoint();
      document.removeEventListener('keydown', closeFormOnEscape);
    });

    render(redactionView, this.#pointsList.element); //мяу?
    render(pointView, this.#pointsList.element);
  }

  init() {

    this.routePoints = this.tripModel.points;

    render(new SortingView(), this.container);
    render(this.#pointsList, this.container);


    for (let i = 1; i < this.routePoints.length; i++) {
      this.#renderPoint(this.routePoints[i]);
    }

  }

}

export default Presenter;
