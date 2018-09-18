const util = require('./utils/utils');
const fetchBookInfo = require('./utils/fetch/fetchBookInformation');
const fetchBookUrls = require('./utils/fetch/fetchBookUrls');


const getBooks = async (url) => {
  const urlsAndPages = await fetchBookUrls.fetchBookUrlsAndPages(url);
  const booksPromises = urlsAndPages.books.map(book => fetchBookInfo.fetchBook(book));

  const books = await Promise.all(booksPromises);
  return {
    books,
    pageCount: urlsAndPages.pageCount,
    nextPageUrl: urlsAndPages.nextPageUrl,
    prevPageUrl: urlsAndPages.prevPageUrl,
  };
};

const getBooksForPhrase = async (phrase, page = 1) => {
  const url = util.createUrl(phrase, page);
  const booksList = await getBooks(url);
  return booksList;
};

const getBooksForLink = async (url) => {
  const booksList = await getBooks(url);
  return booksList;
};

module.exports.getBooksForPhrase = getBooksForPhrase;
module.exports.getBooksForLink = getBooksForLink;
