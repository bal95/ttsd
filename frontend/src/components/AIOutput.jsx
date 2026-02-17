import { useState } from 'react'
import '../styles/AIOutput.css'

function AIOutput({output,audioURL}){
  const [isPlaying,setIsPlaying]=useState(false)

  async function handlePlayButton(){
    const audioPlayer=document.querySelector("audio")
    audioPlayer.play()
    setIsPlaying(true)
  }

  return(
    <div className='container'>
      <div className='aioutput'>
        {output}
      </div>
      <button onClick={handlePlayButton} disabled={isPlaying}>
        ▶️
      </button>
      <audio src={audioURL} style={{display:"none"}} 
      onEnded={()=>setIsPlaying(false)}/>
    </div>
  )
}

export default AIOutput