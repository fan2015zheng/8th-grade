import React from 'react'
import './Navbar.css'
import Util from './Util'
import BookInfo from './BookInfo'

function Navbar({chapter, page, bookKey, updateBookKey,
   tableOfContent, pageCount, updateChapter, updatePage}) {
  const book = BookInfo.getBook(bookKey)

  let pageNumbers = []
  let chapterText = "Chapters"
  let pageText = "Pages"
  if (chapter === 0) {
    chapterText = tableOfContent[chapter]
    pageText = `😁 - ${page}`
  } else if (chapter > 0) {
    chapterText = `§ ${chapter} - ${tableOfContent[chapter]}`
    pageText = `§ ${chapter} - ${page}`
  }
  chapterText = Util.trunkText(chapterText, 30)

  for(let p=1; p<=pageCount; p++) {
    pageNumbers.push(p)
  }
  
  let pageDropDown = null
  if (chapter >= 0) {
    pageDropDown =
    <li className="nav-item dropdown">
    <span className="nav-link dropdown-toggle _pointer" id="navbardrop" data-toggle="dropdown">
      {pageText}
    </span>
    <div className="dropdown-menu _dropMaxH">
      {pageNumbers.map(
        (p) => {
          let pageText2 = `😜 - ${p}`
          if (chapter > 0) {
            pageText2 = `§ ${chapter} - ${p}`
          }
          return (
            <span key={p} className="dropdown-item _pointer"
              onClick={()=>{updatePage(p)}}
            > 
              {pageText2}
            </span>
          )
        }
      )}
    </div>
  </li>
  }
  return(<>
    <nav className="navbar navbar-expand-sm bg-light navbar-light _navbar">
    
      <span className="navbar-brand _brand _pointer" onClick={() => {updateBookKey("")}}>
        {book.name}
      </span>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="collapsibleNavbar">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle _pointer" id="navbardrop" data-toggle="dropdown">
              {chapterText}
            </span>
            <div className="dropdown-menu _dropMaxH">
              {tableOfContent.map((chapterTitle, i) => {
                let chapterText2 = chapterTitle
                if (i > 0) {
                  chapterText2 = `§ ${i} - ${chapterTitle}`
                }
                return (
                  <span key={i} className="dropdown-item _pointer" 
                    onClick={() => {updateChapter(i)}}
                  >
                    {chapterText2}
                  </span>
                )}
              )}
            </div>
          </li>

          {pageDropDown}

        </ul>
       
      </div>
    </nav>
  </>)
}

export default Navbar