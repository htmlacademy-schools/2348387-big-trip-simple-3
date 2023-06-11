import { UpdateAction } from '../util/const.js';
import Observable from '../framework/observable.js';

class TripModel extends Observable {
  #pointsFromAPI = null;
  #setOfDestinations = null;
  #availableOffers = null;
  #points = [];

  constructor(pointsAPI) {
    super();
    this.#pointsFromAPI = pointsAPI;
  }

  get points () {
    return this.#points;
  }

  get destinations () {
    return this.#setOfDestinations;
  }

  get offers () {
    return this.#availableOffers;
  }


  updatePoint = async (type, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointsFromAPI.updatePoint(update);
      const updatedPoint = this.#adaptClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(type, updatedPoint);
    } catch(error) {
      throw new Error('Can\'t update point');
    }
  };

  addPoint = async (type, update) => {
    try {
      const response = await this.#pointsFromAPI.addPoint(update);
      const newPoint = this.#adaptClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(type, newPoint);
    } catch(error) {
      throw new Error('Can\'t add point');
    }
  };

  deletePoint = async (type, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    try {
      await this.#pointsFromAPI.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(type);
    } catch(error) {
      throw new Error('Can\'t delete point');
    }
  };

  #adaptClient = (points) => {
    const adaptedPoint = {
      ...points,
      basePrice: points['base_price'],
      dateFrom: (points['date_from'] !== null ? new Date(points['date_from']) : points['date_from']),
      dateTo: (points['date_to'] !== null ? new Date(points['date_to']) : points['date_to'])
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  };

  async initialize() {
    try {
      const points = await this.#pointsFromAPI.points;
      this.#setOfDestinations = await this.#pointsFromAPI.destinations;
      this.#availableOffers = await this.#pointsFromAPI.offers;
      this.#points = points.map(this.#adaptClient);
      this._notify(UpdateAction.INIT);
    } catch(error) {
      this.#points = [];
      this.#setOfDestinations = null;
      this.#availableOffers = null;
      this._notify(UpdateAction.ERROR);
      throw new Error(error);
    }
  }
}

export default TripModel;
