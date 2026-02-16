from fastapi import FastAPI,UploadFile,Form,File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Annotated
from openai import OpenAI
from base64 import b64encode
import os

load_dotenv()

async def get_text_from_image(type:str,base64image:str)->str:
  '''
  Extracts text from image.
  '''
  MODEL="gpt-5-mini"

  client=OpenAI()
  response=client.chat.completions.create(
    model=MODEL,
    messages=[
      {
        "role":"user",
        "content":[
          {"type":"text","text":"Extract text from the given image file. "
          "If no text is found, reply with 'I cannot find text in the image'"},
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
  
app=FastAPI()
origins=[origin.strip() for origin in 
         os.getenv("ALLOWED_ORIGINS").split(',')]

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
    return {"message":f"{await get_text_from_image(type,base64image)}"}
  except IOError as e:
    print("Error in saving image:",e)
    return {"message":"Error in receiving message!"}