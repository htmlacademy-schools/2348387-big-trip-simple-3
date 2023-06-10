import RedactionView from './view/redactionForm.js';
import PointView from './view/routinePoint.js';
import {render, replace, remove} from './framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointsListContainer = null;
  #pointComponent = null;
  #editPointComponent = null;
  #changeData = null;
  #changeMode = null;

  #mode = Mode.DEFAULT;

  constructor(pointsListContainer, changeData, changeMode) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point) {

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point);
    this.#editPointComponent = new RedactionView(point);

    this.#pointComponent.setClickHandler (() => {
      this.#replacePointWithForm();
      document.addEventListener('keydown', this.#closeFormOnEscape);
    });

    this.#editPointComponent.setSubmitHandler((task) => {
      this.#changeData(task);
      this.#replaceFormWithPoint();
      document.removeEventListener('keydown', this.#closeFormOnEscape);
    });

    this.#editPointComponent.setClickHandler(() => {
      this.#replaceFormWithPoint();
      document.removeEventListener('keydown', this.#closeFormOnEscape);
    });

    if (prevEditPointComponent === null || prevPointComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormWithPoint();
    }
  };

  #replacePointWithForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  }

  #replaceFormWithPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  }

  #closeFormOnEscape = (evt) => {
    if(evt.keyCode === 27) {
      evt.preventDefault();
      this.#replaceFormWithPoint();
      document.removeEventListener('keydown', this.#closeFormOnEscape);
    }
  };
}
