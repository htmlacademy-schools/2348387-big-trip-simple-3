import {render, replace, remove} from '../framework/render.js';
import PointView from '../view/routinePoint.js';
import PointEditView from '../view/redactionForm.js';
import { UserAction, UpdateType } from '../mock/const.js';
import { compareDates } from '../util/utils.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

class PointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #mode = Mode.DEFAULT;
  #availableOffers = [];

  constructor(pointListContainer, changeData, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
  }

  init(point, availableOffers, availableDestinations) {
    this.#point = point;
    this.#availableOffers = availableOffers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(point, availableOffers, availableDestinations);
    this.#pointEditComponent = new PointEditView(point, availableOffers, availableDestinations);

    this.#pointComponent.setEditButtonClickHandler(this.#handleEditClick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setFormResetHandler(this.#replaceFormToPoint);
    this.#pointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    if (this.#pointListContainer.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListContainer.element.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
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
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };


  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#availableOffers);
      this.#replaceFormToPoint();
    }
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.keyCode === 27) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point, this.#availableOffers);
      this.#replaceFormToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
  };

  #handleDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormSubmit = (update) => {
    const isMinorUpdate = compareDates(update.date_from);
    this.#changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH, //мяу?
      update,
    );
    this.#replaceFormToPoint();
  };
}

export default PointPresenter;
