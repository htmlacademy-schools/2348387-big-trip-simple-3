import { generatePoints } from '../mock/mock.js';

const POINT_COUNT = 3;

class TripModel {
  #points = [];

  constructor() {
    this.#points.push(...generatePoints(POINT_COUNT));
  }

  get points() {
    return this.#points;
  }
}

export default TripModel;
