# TTSD - Text Translator, Summarizer and Dictator

## Description

An application that accepts image with text as input and perform the following operations:

- Translates the text in a specified language
- Summarizes the text in a specified language
- Dictates the original, translated or specified text in the displayed language

## Structure

- Backend: FastAPI server that communicates to OpenAI GPT-4o model for the tasks.
- Frontend: Vite + React app that sends the text image to the server