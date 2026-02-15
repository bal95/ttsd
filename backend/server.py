from fastapi import FastAPI,UploadFile,Form,File
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import Annotated
import os

load_dotenv()

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
  try:
    with open(image.filename,"wb") as file:
      file.write(await image.read())
  except IOError as e:
    print("Error in saving image:",e)
  print(lang,option)