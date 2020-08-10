import React, {useState, useEffect, useRef} from 'react'
import './Book.css'
import Navbar from './Navbar'
import Paper from './Paper'

function Book({chapterCount}) {
  const [chapter, setChapter] = useState(0)
  const [showChapterLastPage, setShowChapterLastPage] = useState(false)
  const [page, setPage] = useState(1)
  const [chapterPages, setChapterPages] = useState([])
  let tableOfContent = useRef([])
  let chapterText = useRef("")
  
  const pagePaddingTop = 25
  const pagePaddingLeft = 30
  const pagePaddingRight = 15
  const fontSize = '22px'
  const lineHeight = '28px'
  
  function handleResize() {
    const pages = formatPages(chapterText.current, chapter)
    setChapterPages(pages)
  }

  useEffect(()=> {
    window.addEventListener('resize',handleResize)

    return ()=> {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(()=>{
    fetch(`http://localhost:3000/books/8th-grade/tableOfContent.json`)
    .then(res => res.json())
    .then(data => {
      tableOfContent.current = data
    })
  })


  useEffect(()=> {
    if (chapter !== undefined ) {
      fetch(`http://localhost:3000/books/8th-grade/chapter${chapter}.txt`)
      .then(res => res.text())
      .then(data => {
         chapterText.current = data
         const pages = formatPages(data, chapter)

         if (showChapterLastPage) {
           setPage(pages.length)
         } else {
           setPage(1)
         }
    
         setChapterPages(pages)
         setChapter(chapter)
      })
    }
  },[chapter, showChapterLastPage])

  function formatPages(data, chapter) {
    const paperWidth = window.visualViewport.width
    const paperHeight = window.visualViewport.height
    const xMax = paperWidth - pagePaddingLeft - pagePaddingRight
    const yMax = paperHeight - pagePaddingTop * 2

    const pages = formatPagesBasedOnPageSize(data, Math.ceil(xMax/10), Math.floor(yMax/28))
   
    pages[0] = `<div class='_page0'>
                  <div>
                    Chapter ${chapter} <br/>
                    ${tableOfContent.current[chapter]}
                  </div>
                </div>
                `
    return pages
  }


  function updateChapter(chapter) {
    setChapter(chapter)
    setPage(1)
  }
  function updatePage(page) {
    setPage(page)
  }

  function nextPage() {
    const pageCount = chapterPages.length
   
    if (page + 1 <= pageCount) {

      setPage(page+1)
    } else if (chapter + 1 <= chapterCount) {
      setChapter(chapter+1)
      setShowChapterLastPage(false)
    }
  }
  function prevPage() {
    if (page - 1 > 0) {
      setPage(page - 1)
    } else if (chapter - 1 >= 0) {
      setChapter(chapter - 1)
      setShowChapterLastPage(true)
    }
  }

  return(<>
    <Paper chapter={chapter} page={page}
     updateChapter={updateChapter} updatePage={updatePage} 
     text={chapterPages[page-1] ?? ""}
     pagePaddingLeft={pagePaddingLeft}
     pagePaddingRight={pagePaddingRight}
     pagePaddingTop={pagePaddingTop}
     fontSize={fontSize}
     lineHeight={lineHeight}
     prevPage={prevPage}
     nextPage={nextPage}
     />

    <div className="collapse" id="bookNavbar">
      <Navbar chapter={chapter} page={page} 
        tableOfContent={tableOfContent.current}
        pageCount = {chapterPages.length}
        updateChapter={updateChapter} updatePage={updatePage}/>
    </div>
  </>)
}

export default Book

function formatPagesBasedOnPageSize(data, pageXMax, pageYMax) {

  function newPage() {
    const pageInfo = {}
    pageInfo.x = 0
    pageInfo.y = 1
    pageInfo.html = ""
    pageInfo.xMax = pageXMax
    pageInfo.yMax = pageYMax
    return pageInfo
  }

  const lines = data.split('\n')
  const pages = [""]
  let pageInfo = newPage()
  let lineCount = lines.length
  
  for(let ln=0; ln<lineCount; ln++) {

    const words = lines[ln].trim().split(" ")
    const wordCount = words.length
    
    if (ln>0) {
      if (!write(pageInfo,'#newline')) {
        pages.push(pageInfo.html)
        pageInfo = newPage()
      }
      write(pageInfo, "#indent")
    }
    
    for(let w=0; w<wordCount; w++) {
      let word = words[w]
      if (ln===0 && w < 3) {
        word = word.toUpperCase()
      }
      if (!write(pageInfo, word)){
        pages.push(pageInfo.html)
        pageInfo = newPage()
        write(pageInfo, word)
      }
    }
  }
  pages.push(pageInfo.html)
  return pages
}



function write(pageInfo, word) {
  if (word === '#newline') {
    if (pageInfo.y < pageInfo.yMax) {
      pageInfo.html = pageInfo.html + '<br/>'
      pageInfo.y = pageInfo.y + 1
      pageInfo.x = 0
      return true;
    } else {
      return false
    }
  }
  if (word === '#indent') {
    pageInfo.html = pageInfo.html + "<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>"
    pageInfo.x = pageInfo.x + 4
    return true
  }
  const len = wordLength(word)
  if (pageInfo.x + 1 + len <= pageInfo.xMax) {
    pageInfo.html = pageInfo.html + " " + word
    pageInfo.x = pageInfo.x + 1 + len
    return true
  } else {
    if (pageInfo.y < pageInfo.yMax) {
      pageInfo.html = pageInfo.html + " " + word
      pageInfo.x = len
      pageInfo.y = pageInfo.y + 1
      return true
    } else  {
      return false
    }
  }
}

function wordLength(word) {
  const charArray = word.split("")
  let len = 0
  charArray.forEach(c => {
    if (
      c===',' || 
      c==="'" ||
      c==='.' ||
      c==='l' ||
      c==='t' ||
      c==='i')
    {
      len = len + 0.5
    } else {
      len = len + 1
    }
  })
  return len
}