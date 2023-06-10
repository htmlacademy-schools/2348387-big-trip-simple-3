import TripModel from './model/tripModel.js';
import FilterFormView from './view/filters.js';
import TripPresenter from './presenter/presenter.js';
import {render} from './framework/render.js';
import { generateFilter } from './mock/mock.js';

const tripEventsContainer = document.querySelector('.trip-events');
const filterFormContainer = document.querySelector('.trip-controls__filters');

const model = new TripModel();
const tripPointsPresenter = new TripPresenter(tripEventsContainer, model);

const filters = generateFilter(model.points);

render(new FilterFormView(filters), filterFormContainer);
tripPointsPresenter.init();
