import React, {useState} from 'react'
import './App.css'
import Book from './Book'
import BookList from './BookList'

function App() {

  const [bookKey, setBookKey] = useState("")

  function updateBookKey(key) {
    setBookKey(key)
  }
  let appContent = <BookList updateBookKey={updateBookKey}/>
  if (bookKey) {
    appContent = <Book chapterCount={18} bookKey={bookKey} updateBookKey={updateBookKey}/>
  }
  
  return (<>
    {appContent}
  </>);
}

export default App
