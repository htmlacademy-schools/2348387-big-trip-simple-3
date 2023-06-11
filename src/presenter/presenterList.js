import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { RenderPosition, render, remove } from '../framework/render.js';
import PointPresenter from './presenterPoints.js';
import NewPointPresenter from './presenterNew';
import EmptyListView from '../view/emptyEntryView';
import LoadingView from '../view/loadingView';
import { SortType, UserAction, UpdateAction, FilterType, TimeLimit } from '../util/const.js';
import { filter, sortDays, sortPrices } from '../util/utils.js';
import EventListView from '../view/eventListView';
import SortingView from '../view/sortView';

class ListPresenter {
  #isLoading = true;

  #emptyEntry = null;
  #pointSorter = null;

  #filter = FilterType.EVERYTHING;
  #sort = SortType.DAY;

  #tripPoints = new EventListView();
  #loadingEntry = new LoadingView();
  #tripPointPresenter = new Map();
  #blockerUI = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #container;
  model;
  #filterModel;
  #newPointPresenter;

  constructor (container, model, filterModel) {
    this.model = model;
    this.#container = container;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter(this.#tripPoints.element, this.#handleViewAction);
    this.model.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filter = this.#filterModel.filter;
    const points = this.model.points;
    const filteredPoints = filter[this.#filter](points);

    switch (this.#sort) {
      case SortType.DAY:
        return filteredPoints.sort(sortDays);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrices);
    }

    return filteredPoints;
  }

  initialize() {
    this.#renderBody();
  }

  createPoint = (callback) => {
    this.#sort = SortType.DAY;
    this.#filterModel.setFilter(UpdateAction.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(callback, this.model.destinations, this.model.offers);
  };

  #clearPointList = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.destroy());
    this.#tripPointPresenter.clear();

    remove(this.#pointSorter);
    remove(this.#loadingEntry);

    if (this.#emptyEntry) {
      remove(this.#emptyEntry);
    }

    if (resetSortType) {
      this.#sort = SortType.DAY;
    }
  };

  #renderPoint = (point) => {
    const destinationList = this.model.destinations;
    const offerList = this.model.offers;
    const tripPointPresenter = new PointPresenter(this.#tripPoints, this.#handleViewAction, this.#handleChangeMode, destinationList, offerList);
    tripPointPresenter.init(point);
    this.#tripPointPresenter.set(point.id, tripPointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderEmptyList = (isError = false) => {
    this.#emptyEntry = new EmptyListView(this.#filter, isError);
    render(this.#emptyEntry, this.#container);
  };

  #renderLoading = () => {
    render(this.#loadingEntry, this.#tripPoints.element, RenderPosition.AFTERBEGIN);
  };

  #renderSorted = () => {
    this.#pointSorter = new SortingView(this.#sort);
    this.#pointSorter.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#pointSorter, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderBody = () => {
    render(this.#tripPoints, this.#container);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    const points = this.points;
    const pointCount = points.length;
    if (pointCount === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderSorted();

    this.#renderPoints();
  };

  #handleViewAction = async (action, updateType, update) => {
    this.#blockerUI.block();

    switch (action) {
      case UserAction.UPDATE_POINT:
        this.#tripPointPresenter.get(update.id).setSaving();
        try {
          await this.model.updatePoint(updateType, update);
        } catch(error) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.model.addPoint(updateType, update);
        } catch(error) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#tripPointPresenter.get(update.id).setDeleting();
        try {
          await this.model.deletePoint(updateType, update);
        } catch(error) {
          this.#tripPointPresenter.get(update.id).setAborting();
        }
        break;
    }
    this.#blockerUI.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateAction.PATCH:
        this.#tripPointPresenter.get(data.id).init(data);
        break;
      case UpdateAction.MINOR:
        this.#clearPointList();
        this.#renderBody();
        break;
      case UpdateAction.MAJOR:
        this.#clearPointList({resetSortType: true});
        this.#renderBody();
        break;
      case UpdateAction.INIT:
        this.#isLoading = false;
        remove(this.#loadingEntry);
        this.#renderBody();
        break;
      case UpdateAction.ERROR:
        this.#isLoading = false;
        remove(this.#loadingEntry);
        this.#renderEmptyList(true);
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#sort === sortType) {
      return;
    }

    this.#sort = sortType;
    this.#clearPointList();
    this.#renderBody();
  };

  #handleChangeMode = () => {
    this.#newPointPresenter.destroy();
    this.#tripPointPresenter.forEach((presenter) => presenter.resetView());
  };
}

export default ListPresenter;
