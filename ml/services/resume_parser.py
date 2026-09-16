import json
import re
import time

import httpx

from config import GEMINI_API_KEY

GEMINI_MODEL = "gemini-flash-latest"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)
MAX_ATTEMPTS = 3
RETRYABLE_STATUS_CODES = {429, 500, 502, 503, 504}
LOCAL_SKILLS = (
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "Go", "PHP",
    "Ruby", "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask",
    "FastAPI", "Spring", "Next.js", "HTML", "CSS", "Tailwind CSS", "SQL",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Docker", "Kubernetes", "AWS",
    "Azure", "Git", "GitHub", "REST API", "GraphQL", "Machine Learning",
    "Deep Learning", "Data Analysis", "Project Management", "Communication",
)

SKILL_EXTRACTION_PROMPT = """You are a resume parser. Read the resume text below and extract every \
professional skill it mentions: programming languages, frameworks, tools, \
platforms, databases, methodologies, and soft skills. Only include skills \
that are actually stated in the text - never invent one. Do not include job \
titles, company names, degrees, or personal details.

Return ONLY a JSON array of short skill name strings (no explanations, no \
markdown fences), each written in its normal form (e.g. "React", "Python", \
"Project Management"), deduplicated.

Resume text:\\\
\"\"\"
{text}
\"\"\"
"""


def _extract_local_skills(text):
    text_lower = text.lower()
    return [
        skill
        for skill in LOCAL_SKILLS
        if re.search(rf"(?<!\w){re.escape(skill.lower())}(?!\w)", text_lower)
    ]


def extract_skills(text):
    """
    Uses Gemini to read the resume text directly and extract whatever
    skills it actually contains, instead of matching against a fixed
    keyword list.
    """
    if not text or not text.strip():
        return []

    if not GEMINI_API_KEY:
        raise RuntimeError(
            "GEMINI_API_KEY is not configured for the ML service "
            "(set it in ml/.env)."
        )

    prompt = SKILL_EXTRACTION_PROMPT.format(text=text[:12000])

    for attempt in range(1, MAX_ATTEMPTS + 1):
        try:
            response = httpx.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0,
                    },
                },
                timeout=httpx.Timeout(connect=10, read=15, write=10, pool=10),
            )
            response.raise_for_status()
            data = response.json()
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            skills = json.loads(raw_text)
            break
        except httpx.HTTPStatusError as error:
            if (
                error.response.status_code not in RETRYABLE_STATUS_CODES
                or attempt == MAX_ATTEMPTS
            ):
                raise RuntimeError(
                    f"Skill extraction via Gemini failed: {error}"
                ) from error
            time.sleep(2**attempt)  # 2s, 4s
        except httpx.TimeoutException as error:
            return _extract_local_skills(text)
        except (httpx.HTTPError, KeyError, IndexError, json.JSONDecodeError) as error:
            raise RuntimeError(f"Skill extraction via Gemini failed: {error}") from error

    if not isinstance(skills, list):
        return []

    # Dedupe (case-insensitive) while preserving Gemini's original casing/order.
    seen = set()
    result = []
    for skill in skills:
        if not isinstance(skill, str):
            continue
        cleaned = skill.strip()
        key = cleaned.lower()
        if cleaned and key not in seen:
            seen.add(key)
            result.append(cleaned)
    return result
