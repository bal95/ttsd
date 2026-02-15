import './App.css'
import { useRef, useState } from 'react'
import ImageGetter from './components/ImageGetter'
import AIOutput from './components/AIOutput'

function App() {
  const SERVER_URL=import.meta.env.VITE_SERVER_URL
  const [option,setOption]=useState("translate")
  const [lang,setLang]=useState("english")
  let imageRef=useRef(null)

  async function handleSubmit(){
    const file=imageRef.current?.files[0]
    const formData=new FormData()
    formData.append('image',file)
    formData.append('option',option)
    formData.append('lang',lang)
    try{
      const res=await fetch(`${SERVER_URL}/api/upload-image`,{
        method:"POST",
        body:formData
      })
      if(res.ok) alert("Upload success")
      else alert("Upload error")
    }
    catch(error){
      alert(error)
    }
  }

  return (
    <div className='app'>
      <ImageGetter imageRef={imageRef} 
      setOption={setOption} setLang={setLang} 
      handleSubmit={handleSubmit} />
      <AIOutput />
    </div>
  )
}

export default App
