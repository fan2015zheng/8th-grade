import React from 'react'
import './Navbar.css'
import Util from './Util'

function Navbar({chapter, page, tableOfContent, pageCount, updateChapter, updatePage}) {
  let pageNumbers = []
  for(let p=1; p<=pageCount; p++) {
    pageNumbers.push(p)
  }
  return(<>
    <nav className="navbar navbar-expand-sm bg-light navbar-light _navbar">
    
      <span className="navbar-brand _brand">8th Grade</span>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="collapsibleNavbar">
        <ul className="navbar-nav">
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle _pointer" id="navbardrop" data-toggle="dropdown">
              {Util.trunkText(`§ ${chapter} - ${tableOfContent[chapter]}`, 30)}
            </span>
            <div className="dropdown-menu _dropMaxH">
              {tableOfContent.map((chapterTitle, i) => {
                return (
                  <span key={i} className="dropdown-item _pointer" 
                    onClick={() => {updateChapter(i)}}
                  >
                    § {i} - {chapterTitle}
                  </span>
                )}
              )}
            </div>
          </li>

          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle _pointer" id="navbardrop" data-toggle="dropdown">
              {`§ ${chapter} - ${page}`}
            </span>
            <div className="dropdown-menu _dropMaxH">
              {pageNumbers.map(
                (p) => 
                <span key={p} className="dropdown-item _pointer"
                  onClick={()=>{updatePage(p)}}
                > 
                  {`§ ${chapter} - ${p}`}
                </span>
              )}
            </div>
          </li>
        </ul>
       
      </div>
    </nav>
  </>)
}

export default Navbar