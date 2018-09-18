const cherio = require('cherio');

const BASE_URL = 'http://lubimyczytac.pl/szukaj/ksiazki';

const createUrl = (phrase, page) => {
  if (page === 1) {
    return `${BASE_URL}?phrase=${phrase}`;
  }
  return `${BASE_URL}/${page}?phrase=${phrase}`;
};

const setupOptions = (method = 'GET', uri, queryStrings = {}) => ({
  uri,
  qs: queryStrings,
  method,
  transform: body => cherio.load(body),
});

const filterUrls = urls => urls.filter(u => u.match(/\/ksiazka\//));

const removeDuplicates = array => Array.from(new Set(array));

module.exports.createUrl = createUrl;
module.exports.setupOptions = setupOptions;
module.exports.filterUrls = filterUrls;
module.exports.removeDuplicates = removeDuplicates;
