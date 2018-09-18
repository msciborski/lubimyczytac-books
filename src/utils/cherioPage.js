const util = require('./utils');
const rp = require('request-promise');

const getCherioPage =  async url => await rp(util.setupOptions('GET', url));

module.exports.getCherioPage = getCherioPage;