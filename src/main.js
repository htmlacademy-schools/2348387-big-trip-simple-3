import { render } from './framework/render.js';
import ListPresenter from './presenter/presenterList.js';
import TripModel from './model/tripModel.js';
import FilterModel from './model/filterModel.js';
import FilterPresenter from './presenter/presenterFilter.js';
import NewPointButtonView from './view/newPointButton.js';
import PointsApiService from './util/API.js';

const AUTHORIZATION = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointsContainer = document.querySelector('.trip-events');
const buttonContainer = document.querySelector('.trip-main');

const tripPointsModel = new TripModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripPresenter = new ListPresenter(pointsContainer, tripPointsModel, filterModel);
tripPresenter.init();
const filterPresenter = new FilterPresenter(filtersContainer, filterModel, tripPointsModel);

filterPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  tripPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

tripPointsModel.init()
  .catch(() => {
    newPointButtonComponent.element.disabled = true;
  })
  .finally(() => {
    render(newPointButtonComponent, buttonContainer);
    newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
  });
