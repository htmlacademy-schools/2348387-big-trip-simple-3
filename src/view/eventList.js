import {createElement, render} from '../framework/render.js';
import AbstractView from '../framework/view/abstract-view.js';

const makePointListSample = () =>
  `<ul class="trip-events__list">
  </ul>`;

const makePointListItemSample = () =>
  `<li class="trip-events__item">
  </li>`;


class PointListView extends AbstractView {
  get template() {
    return makePointListSample();
  }

  addComponent(component) {
    const li = createElement(makePointListItemSample());
    render(component, li);
    this.element.append(li);
  }
}

export default PointListView;
