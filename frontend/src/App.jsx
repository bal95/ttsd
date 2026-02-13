import './App.css'
import { useRef, useState } from 'react'

function App() {
  const SERVER_URL=import.meta.env.VITE_SERVER_URL
  const [preview,setPreview]=useState(null)
  let inputRef=useRef(null)

  function handleImageInput(e){
    const file=e.target.files[0]
    if(!file) return
    setPreview(URL.createObjectURL(file))
  }

  async function sendImage(){
    const file=inputRef.current?.files[0]
    if(!file) alert("Please select an image first!")
    const formData=new FormData()
    formData.append('image',file)
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
    <>
      <label htmlFor="imageFile">Upload PNG, JPG or JPEG image: </label>
      <input type="file" accept="image/*" name="imageFile" id="imageFile" 
        ref={inputRef} onChange={handleImageInput}/>
      {preview && <img src={preview} alt="Preview Image" className="preview"/>}
      <button onClick={sendImage}>Submit</button>
    </>
  )
}

export default App
