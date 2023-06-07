import TripModel from './model/tripModel.js';
import Presenter from './presenter.js';
import FiltersView from './view/filters.js';
import { render } from './render.js';


const filtersContainer = document.querySelector('.trip-controls__filters');
render(new FiltersView(), filtersContainer);

const model = new TripModel();
const container = document.querySelector('.trip-events');
const tripPresenter = new Presenter(container, model);

tripPresenter.init();
