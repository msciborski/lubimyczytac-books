const rp = require('request-promise');
const cherio = require('cherio');

const BASE_URL = 'http://lubimyczytac.pl/szukaj/ksiazki';

const createUrl = (phrase, page) => {
  if(page === 1) {
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

const fetchBookUrls = ($) => {
  const results = $('.books-list .bookTitle')
    .map((_, el) => $(el).attr('href')).get();
  return filterUrls(results);
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
  const $ = await rp(setupOptions('GET', urlForSearch));
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

const fetchBookDetails = ($) => {
  const isbn = $('dd span[itemprop="isbn"]').text();
  const publishingDate = $('dd[itemprop="datePublished"]').attr('content');

  return {
    isbn,
    publishingDate,
  };
};

const fetchBook = async (bookUrl) => {
  const $ = await rp(setupOptions('GET', bookUrl));

  let title = $('h1[itemprop="name"] a').text();
  if (title === '') {
    title = $('h1[itemprop="name"]').text();
  }

  const author = $('.author-info-container a[itemprop="name"]').map((_, el) => $(el).text()).get().join(' ,');
  const bookDetails = fetchBookDetails($);
  return {
    title,
    author,
    isbn: bookDetails.isbn,
    publishingDate: bookDetails.publishingDate,
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
  const url = createUrl(phrase, page);
  const booksList = await getBooks(url);
  return booksList;
};

const getBooksForLink = async (url) => {
  const booksList = await getBooks(url);
  return booksList;
};

module.exports.getBooksForPhrase = getBooksForPhrase;
module.exports.getBooksForLink = getBooksForLink;
