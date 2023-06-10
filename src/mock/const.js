const DESCRIPTION = (`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna,
non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
 Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae,
 sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.
 Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus.
 In rutrum ac purus sit amet tempus.`).split('. ');

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const CITIES = ['Paris', 'Chicago', 'Moscow', 'Berlin', 'Tokyo', 'Bogota', 'Rome', 'Warsaw', 'London'];

const OFFERS = [
  {
    id: 1,
    title: 'Upgrade a business class',
    price: 120
  },
  {
    id: 2,
    title: 'Add luggage',
    price: 20
  },
  {
    id: 3,
    title: 'Switch to comfort',
    price: 50
  },
  {
    id: 4,
    title: 'Add meal',
    price: 90
  },
  {
    id: 5,
    title: 'Choose seats',
    price: 35
  },
  {
    id: 6,
    title: 'Travel by train',
    price: 190
  },
  {
    id: 7,
    title: 'Add alcohol',
    price: 250
  },
  {
    id: 8,
    title: 'Upgrade a car',
    price: 120
  },
  {
    id: 9,
    title: 'No queue',
    price: 150
  }
];

const getOfferName = (offerId) => OFFERS.find((offer) => offer.id === offerId).title;
const getOfferPrice = (offerId) => OFFERS.find((offer) => offer.id === offerId).price;

const taxiOffers = [1, 3];

const busOffers = [5, 6];

const trainOffers = [4, 5, 7];

const shipOffers = [4, 5, 7];

const driveOffers = [8];

const flightOffers = [4, 5, 6, 7];

const checkInOffers = [9];

const sightseeingOffers = [];

const restaurantOffers = [5];

const getArrayFromType = (type) => {
  switch (type) {
    case 'taxi':
      return taxiOffers;
    case 'bus':
      return busOffers;
    case 'train':
      return trainOffers;
    case 'ship':
      return shipOffers;
    case 'drive':
      return driveOffers;
    case 'flight':
      return flightOffers;
    case 'check-in':
      return checkInOffers;
    case 'sightseeing':
      return sightseeingOffers;
    case 'restaurant':
      return restaurantOffers;
  }
};

const FilterType = {
  ALL: 'everything',
  FUTURE: 'future',
};

const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export {DESCRIPTION, TYPES, CITIES, OFFERS, FilterType, SortingType};
export {getOfferName, getOfferPrice, getArrayFromType};
