const util = require('../utils');
const cherioPage = require('../cherioPage');

const fetchPageCount = ($) => {
  const lastPage = $('.pager-default td ul li:not(.next-page):not(.prev-page) a')
    .map((_, el) => parseInt($(el).text(), 10)).get()
    .sort((a, b) => b - a)[0];

  return lastPage && 1;
};

const fetchBookUrls = ($) => {
  const results = $('.books-list .bookTitle')
    .map((_, el) => $(el).attr('href')).get();
  return util.filterUrls(results);
};

const fetchNextPageUrl = ($) => {
  const nextPageUrl = $('.pager-default li.next-page a').attr('href');
  return nextPageUrl === '#' ? undefined : nextPageUrl;
};

const fetchPrevPageUrl = ($) => {
  const prevPageUrl = $('.pager-default li.prev-page a').attr('href');
  return prevPageUrl === '#' ? undefined : prevPageUrl;
};

const fetchBookUrlsAndPages = async (urlForSearch) => {
  const $ = await cherioPage.getCherioPage(urlForSearch);
  const bookUrls = fetchBookUrls($);
  const nextPageUrl = fetchNextPageUrl($);
  const prevPageUrl = fetchPrevPageUrl($);
  const pageCount = fetchPageCount($);

  return {
    pageCount,
    books: bookUrls,
    prevPageUrl,
    nextPageUrl,
  };
};

module.exports.fetchBookUrlsAndPages = fetchBookUrlsAndPages;
