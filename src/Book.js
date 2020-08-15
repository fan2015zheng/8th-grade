import React, {useState, useEffect, useRef} from 'react'
import './Book.css'
import Navbar from './Navbar'
import Paper from './Paper'
import BookInfo from './BookInfo'

function Book({bookKey, updateBookKey}) {

  const book = BookInfo.getBook(bookKey)
  const chapterCount = book.chapterCount

  const netlify = "https://8th-grade.netlify.app"
  const localhost = "http://localhost:3000"
  const production = true
  const http = production ? netlify : localhost
  const [chapter, setChapter] = useState(() => -1)
  const [showChapterLastPage, setShowChapterLastPage] = useState(() => false)
  const [page, setPage] = useState(()=>1)
  const [chapterPages, setChapterPages] = useState([])
  let tableOfContent = useRef([])
  let chapterText = useRef("")
  
  const pagePaddingTop = 25
  const pagePaddingLeft = 30
  const pagePaddingRight = 15
  const fontSize = '22px'
  const lineHeight = '28px'
  
  useEffect(()=> {
   
    function handleResize() {
      const pages = formatPages(chapterText.current, chapter, book)
      setChapterPages(pages)
    }
    window.addEventListener('resize',handleResize)

    return ()=> {
      window.removeEventListener('resize', handleResize)
    }
  })

  useEffect(()=>{
    fetch(`${http}/books/${bookKey}/tableOfContent.json`)
    .then(res => {
      return res.json()
    })
    .then(data => {
      tableOfContent.current = data

      if (chapter >= 0) {
        fetch(`${http}/books/${bookKey}/chapter${chapter}.txt`)
        .then(res => res.text())
        .then(data => {
           chapterText.current = data
           const pages = formatPages(data, chapter, book)
  
           if (showChapterLastPage) {
             setPage(pages.length)
           } else {
             setPage(1)
           }
           
           setChapterPages(pages)
        })
      } else  {
        const pages = formatPages("", chapter, book)
        setChapterPages(pages)
      }
    })
  },[chapter, showChapterLastPage,http,bookKey, book])


  function formatPages(data, chapter, book) {
    let pages = [""]

    if (chapter === -1) {
      pages[0] = `<div class='_bookName'><div>${book.name}</div></div>`
    }
    else {
      const paperWidth = window.visualViewport.width
      const paperHeight = window.visualViewport.height
      const xMax = paperWidth - pagePaddingLeft - pagePaddingRight
      let yMax = paperHeight - pagePaddingTop * 2

      if (book.audio && book.audio[chapter]) {
        yMax = yMax - 50
      }
  
      pages = formatPagesBasedOnPageSize(data, xMax/10, Math.floor(yMax/28))
      
      let caption = `Chapter ${chapter} <br/> ${tableOfContent.current[chapter]}`
      if (chapter === 0) {
        caption = tableOfContent.current[chapter]
      }

      pages[0] = `<div class='_page0'><div>${caption}</div></div>`
    }
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
    } else if (chapter - 1 >= -1) {
      setChapter(chapter - 1)
      setShowChapterLastPage(true)
    }
  }
  let audioFile = null
  if (book.audio && book.audio[chapter]) {
    audioFile = book.audio[chapter]
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
     audioFile = {audioFile}
     />
    
    <div className="collapse" id="bookNavbar">
      <Navbar chapter={chapter} page={page} bookKey={bookKey}
        updateBookKey={updateBookKey}
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