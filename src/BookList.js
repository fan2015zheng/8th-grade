import React from 'react'
import './BookList.css'
import BookInfo from './BookInfo'

function BookList({updateBookKey}) {
  return(<>
    <div className="container">
      <div className="row">
        <div className="text-center _brandDiv">
          <span className="_brandText">Movie Read</span>
        </div>
      </div>
      <div className="row">
        {BookInfo.getBooks().map((book, i) => {
          const imageStyle = {
            backgroundImage: `url(./img/${book.image}), url(./img/paper.jpg)`,
            height: '350px',
            backgroundRepeat: 'no-repeat, repeat',
            backgroundPosition: 'center top,center'
          }
          return(
            <div key={i} className="col-sm-6 col-lg-4 p-3">
              <div className="_book _pointer" onClick={() => { updateBookKey(book.key) }}>
                <div className="_bookImage" style={imageStyle}></div>
                <div className="text-center p-2">{book.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>

  </>)
}

export default BookList