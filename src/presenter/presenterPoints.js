import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/routinePointView.js';
import { UserAction, UpdateAction } from '../util/const.js';
import { isDatesEqual } from '../util/utils.js';
import RedactionView from '../view/redactionFormView.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class PointPresenter {
  #pointComponent = null;
  #pointEditorComponent = null;

  #container = null;
  #changeData = null;
  #changeMode = null;

  #point = null;
  #mode = Mode.DEFAULT;

  #availableDestinations = null;
  #availableOffers = null;

  constructor(container, changeData, changeMode, destinations, offers) {
    this.#container = container;
    this.#changeData = changeData;
    this.#changeMode = changeMode;

    this.#availableDestinations = destinations;
    this.#availableOffers = offers;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditorComponent = this.#pointEditorComponent;

    this.#pointComponent = new PointView(this.#availableDestinations, this.#availableOffers, point);
    this.#pointEditorComponent = new RedactionView(this.#availableDestinations, this.#availableOffers, point);

    this.#pointComponent.setEditClickHandler(this.#replacePointToForm);

    this.#pointEditorComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditorComponent.setCloseButtonClickHandler(this.#replaceFormToPoint);
    this.#pointEditorComponent.setDeleteButtonClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditorComponent === null) {
      render(this.#pointComponent, this.#container.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditorComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditorComponent);
  }

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditorComponent.updateElement({
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditorComponent.updateElement({
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditorComponent.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditorComponent.shake(resetFormState);
  };

  #replaceFormToPoint = () => {
    this.#pointEditorComponent.reset(this.#point);
    replace(this.#pointComponent, this.#pointEditorComponent);
    this.#pointEditorComponent.removeEscKeydownHandler();
    this.#mode = Mode.DEFAULT;
  };

  #replacePointToForm = () => {
    this.#pointEditorComponent.setEscKeydownHandler(this.#replaceFormToPoint);
    this.#changeMode();
    this.#mode = Mode.EDITING;

    replace(this.#pointEditorComponent, this.#pointComponent);
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate =
      !isDatesEqual(this.#point.dateTo, update.dateTo) ||
      !isDatesEqual(this.#point.dateFrom, update.dateFrom) ||
      this.#point.basePrice !== update.basePrice;

    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateAction.MINOR : UpdateAction.PATCH,
      update,
    );
  };

  destroy = () => {
    remove(this.#pointEditorComponent);
    remove(this.#pointComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditorComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #handleDeleteClick = (point) => {
    this.#pointEditorComponent.removeEscKeydownHandler();
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateAction.MINOR,
      point,
    );
  };
}

export default PointPresenter;
