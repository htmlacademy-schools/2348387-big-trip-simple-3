import ListPresenter from './presenter/presenterList.js';
import TripModel from './model/tripModel.js';
import FilterModel from './model/filterModel.js';
import FilterPresenter from './presenter/presenterFilter.js';
import NewPointButtonView from './view/newPointButtonView.js';
import PointsApiService from './util/API.js';
import { render } from './framework/render.js';
import { END_POINT, AUTHORIZATION } from './util/const.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsContainer = document.querySelector('.trip-events');
const buttonContainer = document.querySelector('.trip-main');

const tripPointsModel = new TripModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const presenterTrip = new ListPresenter(pointsContainer, tripPointsModel, filterModel);
presenterTrip.initialize();
const presenterFilter = new FilterPresenter(filtersContainer, filterModel, tripPointsModel);
presenterFilter.initialize();
const newButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newButtonComponent.element.disabled = false;
};
const handleNewPointButtonClick = () => {
  presenterTrip.createPoint(handleNewPointFormClose);
  newButtonComponent.element.disabled = true;
};

tripPointsModel.initialize()
  .catch(() => {
    newButtonComponent.element.disabled = true;
  })
  .finally(() => {
    render(newButtonComponent, buttonContainer);
    newButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
