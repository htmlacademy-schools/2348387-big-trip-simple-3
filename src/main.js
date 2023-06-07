import Presenter from './presenter';
import FiltersView from './view/filters';
import { render } from './render';

const filtersContainer = document.querySelector('.trip-controls__filters');
render(new FiltersView(), filtersContainer);

const container = document.querySelector('.trip-events');
const tripPresenter = new Presenter({container: container});

tripPresenter.init();
