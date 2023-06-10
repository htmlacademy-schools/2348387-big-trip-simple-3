import TripModel from './model/tripModel.js';
import Presenter from './presenter.js';
import FiltersView from './view/filters.js';
import { render } from './framework/render.js';
import { generateFilter } from './mock/mock.js';

const filtersContainer = document.querySelector('.trip-controls__filters');

const model = new TripModel();
const filters = generateFilter(model.points);
render(new FiltersView(filters), filtersContainer);
const container = document.querySelector('.trip-events');
const tripPresenter = new Presenter(container, model);

tripPresenter.init();
