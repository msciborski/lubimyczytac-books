const util = require('../utils');
const cherioPage = require('../cherioPage');


const fetchTitle = ($) => {
  let title = $('h1[itemprop="name"] a').text();
  if (title === '') {
    title = $('h1[itemprop="name"]').text();
  }
  return title;
};

const fetchAuthor = ($) => {
  const authorsList = $('.author-info-container a[itemprop="name"]').map((_, el) => $(el).text()).get();
  return util.removeDuplicates(authorsList);
};

const fetchIsbn = $ => $('dd span[itemprop="isbn"]').text();
const fetchPublishingDate = $ => $('dd[itemprop="datePublished"]').attr('content');

const fetchBook = async (bookUrl) => {
  const $ = await cherioPage.getCherioPage(bookUrl);

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

module.exports.fetchTitle = fetchTitle;
module.exports.fetchAuthor = fetchAuthor;
module.exports.fetchIsbn = fetchIsbn;
module.exports.fetchPublishingDate = fetchPublishingDate;
module.exports.fetchBook = fetchBook;
