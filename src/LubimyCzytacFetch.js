const rp = require('request-promise');
const fetchUtil = require('./utils/utils');

const fetchBookUrls = ($) => {
  const results = $('.books-list .bookTitle')
    .map((_, el) => $(el).attr('href')).get();
  return fetchUtil.filterUrls(results);
};

const fetchNextPageUrl = ($) => {
  const nextPageUrl = $('.pager-default li.next-page a').attr('href');
  return nextPageUrl === '#' ? undefined : nextPageUrl;
};

const fetchPrevPageUrl = ($) => {
  const prevPageUrl = $('.pager-default li.prev-page a').attr('href');
  return prevPageUrl === '#' ? undefined : prevPageUrl;
};

const fetchPageCount = ($) => {
  const lastPage = $('.pager-default td ul li:not(.next-page):not(.prev-page) a')
    .map((_, el) => parseInt($(el).text(),10)).get()
    .sort((a,b) => b - a)[0];
  return lastPage;
};

const fetchBookUrlsAndPages = async (urlForSearch) => {
  const $ = await rp(fetchUtil.setupOptions('GET', urlForSearch));
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

const fetchTitle = ($) => {
  let title = $('h1[itemprop="name"] a').text();
  if (title === '') {
    title = $('h1[itemprop="name"]').text();
  }
  return title;
};

const fetchAuthor = ($) => {
  debugger;
  let authorsList = $('.author-info-container a[itemprop="name"]').map((_, el) => $(el).text()).get();
  return fetchUtil.removeDuplicates(authorsList);
};

const fetchIsbn = $ => $('dd span[itemprop="isbn"]').text();
const fetchPublishingDate = $ => $('dd[itemprop="datePublished"]').attr('content');

const fetchBook = async (bookUrl) => {
  const $ = await rp(fetchUtil.setupOptions('GET', bookUrl));

  const title = fetchTitle($);
  const author = fetchAuthor($);
  const isbn = fetchIsbn($);
  const publishingDate = fetchPublishingDate($);

  return {
    title,
    author,
    isbn,
    publishingDate,
  };
};
const getBooks = async (url) => {
  const urlsAndPages = await fetchBookUrlsAndPages(url);
  const booksPromises = urlsAndPages.books.map(book => fetchBook(book));

  const books = await Promise.all(booksPromises);
  return {
    books,
    pageCount: urlsAndPages.pageCount,
    nextPageUrl: urlsAndPages.nextPageUrl,
    prevPageUrl: urlsAndPages.prevPageUrl,
  };
};

const getBooksForPhrase = async (phrase, page = 1) => {
  const url = fetchUtil.createUrl(phrase, page);
  const booksList = await getBooks(url);
  return booksList;
};

const getBooksForLink = async (url) => {
  const booksList = await getBooks(url);
  return booksList;
};

module.exports.getBooksForPhrase = getBooksForPhrase;
module.exports.getBooksForLink = getBooksForLink;
