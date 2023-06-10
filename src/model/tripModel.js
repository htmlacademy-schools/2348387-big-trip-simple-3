import { generatePoint } from '../mock/mock.js';

class TripModel {

  #points = Array.from({length: 2}, generatePoint);

  get points () {
    return this.#points;
  }
}

export default TripModel;
