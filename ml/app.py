import json
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from config import UPLOAD_FOLDER, PORT
from utils.pdf_utils import extract_text
from services.matcher import compute_match_scores
from services.resume_parser import extract_skills

@asynccontextmanager
async def lifespan(_app):
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    yield

app = FastAPI(title="Job Portfolio ML API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {"message": "Job Portfolio ML API is running", "docs": "/docs"}

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...), jobs: str | None = Form(None)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(file.filename))
    try:
        with open(file_path, "wb") as destination:
            while chunk := await file.read(1024 * 1024):
                destination.write(chunk)

        text = extract_text(file_path)
        skills = extract_skills(text)

        try:
            jobs_list = json.loads(jobs) if jobs else []
        except json.JSONDecodeError as error:
            raise HTTPException(status_code=400, detail="jobs must be valid JSON") from error

        if not isinstance(jobs_list, list):
            raise HTTPException(status_code=400, detail="jobs must be a JSON array")

        matches = compute_match_scores(skills, jobs_list) if jobs_list else []
        return {"skills": skills, "matches": matches}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error
    finally:
        await file.close()
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=PORT, reload=True)