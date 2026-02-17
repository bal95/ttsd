from fastapi import FastAPI,UploadFile,Form,File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from typing import Annotated
from openai import OpenAI
from base64 import b64encode
import os

load_dotenv()

async def get_text_from_image(base64image:str, type:str, option:str, lang:str)->str:
  '''
  Extracts text from image.
  '''
  MODEL="gpt-5-mini"
  TEXT=f"""
  {f"Translate the text in {lang} language with correct grammar and semantics." if option=="translate" else 
    f"Give a concise meaning of text between 100 and 200 words in {lang} language" if option=="summarize"
    else "Extract text from the given image file."
  }
  Only stick to the text of the image. If no text is found, reply with 'I cannot find text in the image😟'
  """

  client=OpenAI()
  response=client.chat.completions.create(
    model=MODEL,
    messages=[
      {
        "role":"user",
        "content":[
          {"type":"text","text":TEXT},
          {
            "type":"image_url",
            "image_url": {
              "url":f"data:image/{type};base64,{base64image}"
            }
          }
        ]
      }
    ]
  )
  return response.choices[0].message.content

def get_speech_from_text(text:str):
  MODEL="gpt-4o-mini-tts"
  INSTRUCTIONS="""Convert given text into speech.
Use same language in which text is written.
If there is no text, reply with 'I'm sorry I don't have the input.' in English.
"""
  client=OpenAI()

  with client.audio.speech.with_streaming_response.create(
    model=MODEL,
    voice="coral",
    input=text,
    instructions=INSTRUCTIONS
  ) as response:
    response.stream_to_file("speech.mp3")

app=FastAPI()
origins=[origin.strip() for origin in 
         os.getenv("ALLOWED_ORIGINS").split(',')]
EXTRACTED_TEXT=''
SPEECH=None

app.add_middleware(CORSMiddleware,
                  allow_origins=origins,
                  allow_credentials=True,
                  allow_headers=["*"],
                  allow_methods=["*"])

@app.post("/api/upload-image")
async def upload_image(image:Annotated[UploadFile,File()],
                       option:Annotated[str,Form()],
                       lang:Annotated[str,Form()]):
  type=image.filename.split('.')[1]
  try:
    base64image=b64encode(await image.read()).decode()
    EXTRACTED_TEXT=await get_text_from_image(base64image,
                    type,option,lang="" if option=="dictate" 
                    else lang)
    get_speech_from_text(EXTRACTED_TEXT)
    return {"message":EXTRACTED_TEXT}
  except IOError as e:
    print("Error in saving image:",e)
    return {"message":"Error in receiving message!"}

@app.get("/api/speech")
def text_to_speech():
  def speech_gen():
    with open("speech.mp3","rb") as speech:
      while chunk:=speech.read(1024):
        yield chunk 
  
  return StreamingResponse(speech_gen(),media_type="audio/mpeg")