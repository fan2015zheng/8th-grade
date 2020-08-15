import React, {useEffect, useRef}  from 'react'
import './Paper.css'

function Paper({ prevPage, nextPage ,text,
  pagePaddingLeft, pagePaddingRight, pagePaddingTop, fontSize, lineHeight,
  audioFile })
{
  const print = useRef()

  useEffect(() => {
    print.current.innerHTML = text 
  })

  const paperStyle = {
    position: 'absolute',
    width: '100%',
    height: '100%',
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

  let audio = null
  if(audioFile) {
    console.log(audioFile)
    audio =     
    <div className="_audioOutter">
      <div className="_audioInner">
        <audio controls className="_audio">
          <source src={`./audio/${audioFile}`} type={`audio/mpeg`} />
        </audio>
      </div>
    </div>
  }
    
  return(<>
    <div style={paperStyle}>
      <div style={printStyle} className="_print" ref={print}>
        
      </div>

      <div className="_paperLeft" onClick={prevPage}/>
      <div className="_paperMiddle" data-toggle="collapse" data-target="#bookNavbar"/>
      <div className="_paperRight" onClick={nextPage}/>
    </div>
    {audio}
  </>)
}

export default Paper
