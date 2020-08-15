const books = [
  {key: "8th-grade", name: "8th Grade", image: "8thGrade.jpg", chapterCount: 18},
  {key: "once", name: "Once", image: "once.jpg", chapterCount: 2,
    audio: {1: "sayItToMeNow.mp3"}
  },
]

export default class BookInfo {
  static getBooks = getBooks
  static getBook = getBook
}
function getBooks() {
  return books
}

function getBook(bookKey) {
  if (!books) {
    return null
  }
  for(let i=0; i<books.length; i++) {
    const book = books[i]
    if (book.key === bookKey) {
      return book;
    }
  }
}