const lubimyCzytacFetch = require('./src/LubimyCzytacFetch');

const fetchBooks = async () => {
  const booksList = await lubimyCzytacFetch.getBooksForLink('http://lubimyczytac.pl/szukaj/ksiazki?phrase=HTML5+i+CSS3');
  console.log(booksList.books);
};

fetchBooks();