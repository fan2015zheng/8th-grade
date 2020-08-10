import React, {useEffect, useRef}  from 'react'
import './Paper.css'

function Paper({ prevPage, nextPage ,text,
  pagePaddingLeft, pagePaddingRight, pagePaddingTop, fontSize, lineHeight})
{
  const print = useRef()

  useEffect(() => {
    print.current.innerHTML = text 
  })

  const paperStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'pink',
    border: '3px dashed tan',
    display: 'flex'
  }
  const printStyle = {
    position: 'absolute',
    top: pagePaddingTop,
    left: pagePaddingLeft,
    right: pagePaddingRight,
    fontSize: fontSize,
    lineHeight: lineHeight
  }

  return(<>
    <div style={paperStyle}>
      <div style={printStyle} className="_print" ref={print}>
        
      </div>

      <div className="_paperLeft" onClick={prevPage}/>
      <div className="_paperMiddle" data-toggle="collapse" data-target="#bookNavbar"/>
      <div className="_paperRight" onClick={nextPage}/>
    </div>
  </>)
}

export default Paper
