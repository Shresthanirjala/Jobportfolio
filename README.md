# Job Portfolio — Job Listing, Resume-Matching & Recommendation Platform

A final-year project: a full-stack job portal where **Job Seekers** upload a CV, get their
skills auto-extracted, and are matched/ranked against live job postings; **Employers** post
vacancies; and an **Admin** manages users, jobs and applications. A grounded chatbot answers
questions about the platform and the currently-posted jobs.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Redux, React Hook Form + Zod, Tailwind CSS |
| Backend API | Node.js, Express, MongoDB (Mongoose), JWT auth, Cloudinary, node-cron, Nodemailer |
| ML service | Python, FastAPI, sentence-transformers, scikit-learn, PyTorch, pdfplumber, python-docx |
| External AI | Google Gemini (`gemini-flash-latest`) for skill extraction and the chatbot |

```
frontend/   React SPA
backend/    Express REST API  (port 3000)
ml/         FastAPI ML micro-service  (port 5001)
```

---

## Algorithms & Techniques Used

**16 distinct algorithms / techniques** are used across the project. **7** of them form the
core resume-to-job **matching and recommendation engine**; the remaining **9** support
NLP/document processing, security, and system resilience.

### A. Core matching & recommendation engine (7)

| # | Algorithm | Where | What it does |
|---|-----------|-------|--------------|
| 1 | **TF-IDF vectorization** (Term Frequency–Inverse Document Frequency) | `ml/services/matcher.py` (`sklearn.TfidfVectorizer`, English stop-word removal) | Converts the candidate's skill text and each job description into weighted term-frequency vectors for lexical/keyword comparison. |
| 2 | **Cosine similarity** | `ml/services/matcher.py` (`sklearn.metrics.pairwise.cosine_similarity` on TF-IDF vectors; `sentence_transformers.util.cos_sim` on embeddings) | Measures the angle between two vectors to score how close a resume is to a job (0–1). |
| 3 | **Sentence-transformer semantic embeddings** (MiniLM / distilled-BERT bi-encoder, model `all-MiniLM-L6-v2`) | `ml/models/embedding_model.py`, `ml/services/matcher.py` | Encodes skills and job descriptions into 384-dimensional dense vectors so semantically related wording ("JS" ≈ "JavaScript") still matches even without shared keywords. |
| 4 | **Hybrid weighted score fusion** (linear ensemble) | `ml/services/matcher.py` — `confidence = 0.7 · semantic + 0.3 · tfidf` | Combines the semantic score and the TF-IDF keyword score into one 0–100 confidence value. |
| 5 | **Jaccard similarity** ( \|A ∩ B\| / \|A ∪ B\| on keyword/niche sets) | `backend/controllers/jobRecommendationController.js`, `backend/utils/similarity.js` | Content-based job recommendation from the overlap between a user's keywords (from past applications or profile niches) and each job's keyword set. |
| 6 | **Score-based ranking + Top-K selection** | `ml/services/matcher.py` (`results.sort(..., reverse=True)`), `jobRecommendationController.js` (`.sort` → `.filter(score > 0)` → `.slice(0, 10)`) | Sorts jobs best-match-first (comparison sort) and returns the top match / top 10. |
| 7 | **Rule-based text normalization & synonym lemmatization** | `jobRecommendationController.js` (`synonymMap`, `normalizePhrase`) | Lowercasing, trimming, and mapping word variants to a root form (`developing/developer → develop`, `designing/designer → design`) before set comparison, to reduce vocabulary mismatch. |

### B. NLP & document processing (4)

| # | Algorithm / Technique | Where | What it does |
|---|-----------------------|-------|--------------|
| 8 | **PDF / DOCX text extraction** | `ml/utils/pdf_utils.py` — pdfplumber (layout-aware page text extraction), python-docx (paragraph traversal) | Pulls raw text out of an uploaded resume file. |
| 9 | **LLM zero-shot skill extraction** (prompt-based information extraction, temperature 0, JSON-constrained output) | `ml/services/resume_parser.py` — Google Gemini | Reads the resume text and returns a deduplicated list of skills, replacing the older fixed keyword-list matching. |
| 10 | **Grounded / RAG-style context construction** | `backend/routes/chatbots.js` | Builds the chatbot's system prompt from live DB job listings (and the job currently being viewed) so answers are grounded on real data and it never invents openings. |
| 11 | **Hash-set deduplication** (case-insensitive) | `ml/services/resume_parser.py` (`seen = set()`), `jobRecommendationController.js` (`keywordsSet`) | Removes duplicate skills / keywords in O(n). |

### C. Security & system algorithms (5)

| # | Algorithm | Where | What it does |
|---|-----------|-------|--------------|
| 12 | **bcrypt adaptive password hashing** (Blowfish-based, key-stretching, cost factor 10) | `backend/models/userSchema.js` pre-save hook + `bcrypt.compare` in `userController.js` | Securely hashes user passwords and verifies them at login. |
| 13 | **JWT (JSON Web Token) signing & verification** (HMAC-SHA256) | `backend/models/userSchema.js` (`getJWTToken`), `backend/middlewares/auth.js` | Stateless authentication token issued on login and checked on protected routes. |
| 14 | **Regex matching + set-membership (`$in`) search / filtering** | `backend/controllers/jobController.js` (`getAllJobs` `$or` + `$regex`), `recommendedJobRoutes.js`, `jobRoutes.js` (`jobNiche: { $in: userInterests }`) | Case-insensitive keyword search across job fields and niche-based filtering. |
| 15 | **Exponential backoff retry** (delay = 2^attempt seconds on HTTP 429/5xx) | `backend/routes/chatbots.js`, `backend/services/mlService.js` flow, `ml/services/resume_parser.py` | Resilient retries for transient failures of the external AI calls. |
| 16 | **Cron time-based scheduling + set-based audience filtering** | `backend/automation/newsLetterCron.js` (`node-cron`, `*/1 * * * *`) | Every minute, finds jobs whose newsletter hasn't been sent, selects users whose niches match the job's niche, emails them, and marks the job as sent. |

---

## Matching pipeline (how the pieces fit together)

```
Resume (PDF/DOCX, Cloudinary URL)
        │
        ▼  backend/services/mlService.js  ──►  POST ml:/parse-resume
        │
        ▼  ml/utils/pdf_utils.py            (8) text extraction
        │
        ▼  ml/services/resume_parser.py     (9) Gemini skill extraction → (11) dedupe
        │
        ▼  ml/services/matcher.py
        │     ├─ (3) sentence-transformer embeddings ─┐
        │     │                                       ├─ (2) cosine similarity
        │     ├─ (1) TF-IDF vectors ──────────────────┘
        │     ├─ (4) confidence = 0.7·semantic + 0.3·tfidf
        │     └─ (6) sort desc, return ranked jobs
        │
        ▼  backend/controllers/matchController.js
             stores skills + jobMatches on the Resume document, returns top match
```

A separate, lighter recommendation path (no ML service needed) runs entirely in the
backend: `jobRecommendationController.js` uses **(7) normalization → (5) Jaccard similarity →
(6) top-10 ranking** over a user's historical/interest keywords.

---

## Notes / honest caveats

- `natural` (Node NLP toolkit) and `python-shell` are listed in `backend/package.json` but
  are **not currently wired into any code path** — the active NLP lives in the Python `ml/`
  service. They can be removed or used for a future in-process implementation.
- `backend/routes/jobRoutes.js` and `backend/routes/recommendedJobRoutes.js` both expose
  niche-based recommendations using a plain MongoDB `$in` query (technique 14); the
  Jaccard-scored version (technique 5) is `jobRecommendationController.js`.
- Skill extraction and the chatbot require a valid `GEMINI_API_KEY` (`ml/.env` and
  `backend/.env` respectively).

---

## Running the project

```bash
# 1. Backend
cd backend && npm install && npm run dev        # http://localhost:3000

# 2. ML service
cd ml && python -m venv .venv && .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app:app --reload --port 5001            # http://localhost:5001/docs

# 3. Frontend
cd frontend && npm install && npm run dev
```

Create an admin account:

```bash
cd backend && node scripts/createAdmin.js       # admin123@gmail.com / admin1234 / role "Admin"
```

Required env vars: `MONGODB_URI`, `JWT_SECRET_KEY`, `JWT_EXPIRE`, `CLOUDINARY_*`,
`SMTP_*`, `GEMINI_API_KEY`, `ML_SERVICE_URL`.
