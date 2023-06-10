
const getRandInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const capitalize = (str) => str[0].toUpperCase() + str.substring(1);

export {getRandInt, capitalize};
