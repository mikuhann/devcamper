const lodash = require('lodash');

const filterFalseValues = (obj) => {
  const filteredArray = lodash.toPairs(obj).filter((item) => item[1]);

  return lodash.fromPairs(filteredArray);
};

module.exports = filterFalseValues;
