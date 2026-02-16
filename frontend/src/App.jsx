import './App.css'
import { useRef, useState } from 'react'
import ImageGetter from './components/ImageGetter'
import AIOutput from './components/AIOutput'

function App() {
  const SERVER_URL=import.meta.env.VITE_SERVER_URL
  const [option,setOption]=useState("translate")
  const [lang,setLang]=useState("english")
  const [output,setOutput]=useState("")
  const [serverStatus,setServerStatus]=useState(false)

  let imageRef=useRef(null)

  async function handleSubmit(){
    setServerStatus(true)
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
      if(res.ok){
        const result=await res.json()
        setOutput(result.message)
        setServerStatus(false)
      }
    }
    catch(error){
      setOutput(error.message)
    }
  }

  return (
    <div className='app'>
      <ImageGetter imageRef={imageRef} 
      setOption={setOption} setLang={setLang} 
      handleSubmit={handleSubmit} />
      <AIOutput output={serverStatus?"Waiting for AI to respond...":output}/>
    </div>
  )
}

export default App
