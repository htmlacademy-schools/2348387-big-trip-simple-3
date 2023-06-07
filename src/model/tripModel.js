import { generatePoint } from '../mock/mock.js';

class TripModel {

  points = Array.from({length: 5}, generatePoint);

  getPoints = () => this.points;

}

export default TripModel;
