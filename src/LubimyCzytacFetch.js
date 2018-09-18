const util = require('./utils/utils');
const fetchBookInfo = require('./utils/fetch/fetchBookInformation');
const fetchBookUrls = require('./utils/fetch/fetchBookUrls');

const getBook = async url => await fetchBookInfo.fetchBook(url);

const getBooks = async (url) => {
  const urlsAndPages = await fetchBookUrls.fetchBookUrlsAndPages(url);
  const booksPromises = urlsAndPages.books.map(book => getBook(book));

  const books = await Promise.all(booksPromises);

  return {
    books,
    pageCount: urlsAndPages.pageCount,
    nextPageUrl: urlsAndPages.nextPageUrl,
    prevPageUrl: urlsAndPages.prevPageUrl,
  };
};

const getBooksFromPhrase = async (phrase, page = 1) => {
  const url = util.createUrl(phrase, page);
  const booksList = await getBooks(url);
  return booksList;
};

const getBooksFromLink = async (url) => {
  const booksList = await getBooks(url);
  return booksList;
};

const getBookFromLink = async url => await getBook(url);

module.exports.getBooksFromPhrase = getBooksFromPhrase;
module.exports.getBooksFromLink = getBooksFromLink;
module.exports.getBookFromLink = getBookFromLink;

