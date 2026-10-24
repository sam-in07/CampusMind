from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="CampusMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the request structure
class ChatRequest(BaseModel):
    message: str

# Ollama Configuration (Default port is 11434)
OLLAMA_URL = "http://localhost:11434/api/generate"

@app.get("/")
async def root():
    return {"message": "CampusMind API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "online"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    payload = {
        "model": "gemma2",
        "prompt": request.message,
        "stream": False
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        return {"response": data.get("response")}
    except Exception as e:
        return {"error": str(e)}
