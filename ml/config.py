import os

from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = "temp_uploads"
MODEL_NAME = "all-MiniLM-L6-v2"
PORT = int(os.environ.get("ML_PORT", 5001))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)