import {remove, render, RenderPosition} from '../framework/render.js';
import RedactionView from '../view/redactionFormView.js';
import {UserAction, UpdateAction} from '../util/const.js';

class NewPointPresenter {
  #pointListContainer = null;
  #changeData = null;
  #newPointForm = null;
  #destroyCallback = null;
  #availableDestinations = null;
  #availableOffers = null;

  constructor(pointListContainer, changeData) {

    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback, destinations = null, offers = null) => {
    this.#availableDestinations = destinations;
    this.#availableOffers = offers;

    this.#destroyCallback = callback;

    if (this.#newPointForm !== null) {
      return;
    }

    this.#newPointForm = new RedactionView(this.#availableDestinations, this.#availableOffers);
    this.#newPointForm.setFormSubmitHandler(this.#handleFormSubmit);
    this.#newPointForm.setDeleteButtonClickHandler(this.#handleDeleteClick);
    this.#newPointForm.setEscKeydownHandler(this.#handleDeleteClick);

    render(this.#newPointForm, this.#pointListContainer, RenderPosition.AFTERBEGIN);
  };

  destroy = () => {
    if (this.#newPointForm === null) {
      return;
    }
    this.#newPointForm.removeEscKeydownHandler();
    this.#destroyCallback?.();

    remove(this.#newPointForm);
    this.#newPointForm = null;
  };

  setSaving = () => {
    this.#newPointForm.updateElement({
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#newPointForm.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#newPointForm.shake(resetFormState);
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateAction.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };
}

export default NewPointPresenter;
