import '../styles/ImageGetter.css'
import { useState } from 'react'

function NoFileSelected({handleButtonClick}){
  return(
    <div className='nofile'>
      <button id="imageUpload"
      onClick={handleButtonClick}>Upload Image</button>
    </div>
  )
}

function ClearImage({handleClear}){
  return(
    <div className='clear' onClick={handleClear}>
      X
    </div>
  )
}

function ImageGetter({imageRef,setOption,setLang,handleSubmit}){
  const [status,setStatus]=useState(false)
  const [preview,setPreview]=useState(null)
  const [showLang,setShowLang]=useState(false)
  const LANGS=["English","Hindi","Latin","Spanish"]

  function handleButtonClick(e){
    const imginp=document.querySelector("input")
    if(e) imginp.click()
  }

  function handleImageInput(){
    const file=imageRef.current?.files[0]
    if(!file) return
    setStatus(true)
    setPreview(URL.createObjectURL(file))
  }

  function handleClear(){
    setPreview(null)
    setStatus(false)
  }

  function handleImageOptions(e){
    setOption(e.target.value)
    if(e.target.value==="dictate")
      setShowLang(true)
    else
      setShowLang(false)
  }

  return(
    <div className='imgget'>
      <div className='display'>
        {status?
          <>
            <ClearImage handleClear={handleClear}/>
            <img src={preview} style={{width:"100%",height:"100%",objectFit:"contain"}} />
          </>
          : <NoFileSelected handleButtonClick={handleButtonClick}/>}
      </div>
      <input type="file" accept="image/*" 
      id="inputImage" ref={imageRef} 
      style={{display:"none"}} onChange={handleImageInput}/>
      <div className='uploadOptions'>
        <select name="option" id="option" 
        onChange={handleImageOptions} defaultValue={"translate"} required>
          <option value="translate">Translate</option>
          <option value="summarize">Summarize</option>
          <option value="dictate">Dictate</option>
        </select>
        <select name="lang" id="lang" disabled={showLang}
          onChange={(e)=>setLang(e.target.value)} defaultValue={"english"}>
          {LANGS.map((lang,idx)=><option key={idx+1} value={lang}>{lang}</option>)}
        </select>
      </div>
      <button id="submit" onClick={handleSubmit} disabled={!status}>
        Submit</button>
    </div>
  )
}

export default ImageGetter