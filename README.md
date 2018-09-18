# lubimyczytac-books

Lubimyczytac-books is utility for scraping books from lubimyczyta.pl

## Installation

Using yarn:

```
yarn add lubimyczytac-books
```
In Node.js:
```
const lb = require('lubimyczytac-books');
```



## Documentation:
### BookList object
```
{
  pageCount: int,
  books: [],
  nextPageUrl: string,
  prevPageUrl: string,
}
```
### Book
```
{
  title: string,
  author: string,
  isbn: string,
  publishingDate: string,
}
```
  

### getBooksFromPhrase(phrase, page)
```
const books = lb.getBooksFromPhrase('Road');
```
Returns promise with books and information about pagination (next page, previous page, page count). `Page` is optional,  default: `1`. 

### getBooksFromLink(url)
```
const books = lb.getBooksFromLink('http://lubimyczytac.pl/szukaj/ksiazki?phrase=Droga');
```
Returns promise with books and information about pagination for provided search url.

### getBookFromLink(url)
```
const book = lb.getBookFromLink('http://lubimyczytac.pl/ksiazka/88820/droga');
```
Returns promise with book. 

## Usage case:
```
const lubimyCzytacFetch = require('./src/LubimyCzytacFetch');

const fetchBooks = async () => {
  const booksList = await lubimyCzytacFetch.getBooksFromLink('http://lubimyczytac.pl/szukaj/ksiazki?phrase=Droga');
  console.log(booksList);
};

fetchBooks();
```



