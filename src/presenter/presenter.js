import PointPresenter from './presenterPoints.js';
import EmptyEntryView from '../view/emptyEntry.js';
import TripEventsView from '../view/eventList.js';
import SortingView from '../view/sort.js';
import { render, remove } from '../framework/render.js';
import { SortingType } from '../mock/const.js';
import { updateItem, diffByDay, diffByPrice } from '../util/utils.js';

class Presenter {

  #pointsListComponent = new TripEventsView();
  #emptyListComponent = new EmptyEntryView();
  #sortingComponent = new SortingView(); //мяу?
  #currentSortType = SortingType.DAY;
  #container = null;
  #tripModel = null;
  #pointsList = [];
  #pointPresenter = new Map();

  constructor(container, tripModel) {
    this.#container = container;
    this.#tripModel = tripModel;
  }

  init() {

    this.#pointsList = this.#tripModel.points;
    this.#renderPage();
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderEmptyList() {
    render(new this.#emptyListComponent, this.#container);
  }

  #renderSort() {
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortingComponent, this.#container);
  }

  #renderList = () => {
    render(this.#pointsListComponent, this.#container);
    for (let i = 0; i < this.#pointsList.length; i++) {
      this.#renderPoint(this.#pointsList[i]);
    }
  };

  #renderPage() {
    if(this.#pointsList.length === 0) {
      this.#renderEmptyList();
      return;
    }

    this.#renderSort(this.#currentSortType);
    this.#renderList();
  }

  #clearPointList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#updateSortMarkup();
    this.#clearPointList();
    this.#renderList();
  };

  #sortPoints = (sortType) => {
    switch(sortType) {
      case SortingType.DAY:
        this.#pointsList.sort(diffByDay);
        break;
      case SortingType.PRICE:
        this.#pointsList.sort(diffByPrice);
        break;
    }
    this.#currentSortType = sortType;
  };

  #updateSortMarkup = () => {
    remove(this.#sortingComponent);
    this.#renderSort();
  };
}

export default Presenter;
