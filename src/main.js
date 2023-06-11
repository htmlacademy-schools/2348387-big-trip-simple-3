import FilterPresenter from './presenter/presenterFilter.js';
import ListPresenter from './presenter/presenterList.js';
import {render} from './framework/render.js';
import TripModel from './model/tripModel.js';
import FilterModel from './model/filterModel.js';
import NewPointButtonView from './view/newPointButton.js';


const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');
const pageHeaderContainer = document.querySelector('.trip-main');

const pointsModel = new TripModel();
const filterModel = new FilterModel();
const listPresenter = new ListPresenter(tripEventsContainer, filterModel, pointsModel);
const filterPresenter = new FilterPresenter(filterFormContainer, filterModel, pointsModel);

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

render(newPointButtonComponent, pageHeaderContainer);
newPointButtonComponent.setClickHandler(handleNewPointButtonClick);
