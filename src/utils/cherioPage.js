const rp = require('request-promise');
const util = require('./utils');

const getCherioPage = async url => rp(util.setupOptions('GET', url));

module.exports.getCherioPage = getCherioPage;
