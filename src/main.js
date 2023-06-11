import FilterPresenter from './presenter/presenterFilter.js';
import ListPresenter from './presenter/presenterList.js';
import {render} from './framework/render.js';
import TripModel from './model/tripModel.js';
import FilterModel from './model/filterModel.js';
import NewPointButtonView from './view/newPointButton.js';
import PointsApiService from './util/API.js';

const AUTHORIZATION = 'Basic kTy9gIdsz2317rD';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';


const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');
const pageHeaderContainer = document.querySelector('.trip-main');

const model = new TripModel(new PointsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(tripEventsContainer, filterModel, model);
const filterPresenter = new FilterPresenter(filterFormContainer, filterModel, model);

filterPresenter.init();
listPresenter.init();

const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handleNewPointButtonClick = () => {
  listPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};

filterPresenter.init();
listPresenter.init();
model.init().finally(() => {
  render(newPointButtonComponent, pageHeaderContainer);
  newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
});
