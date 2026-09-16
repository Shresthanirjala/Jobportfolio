from sentence_transformers import util
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models.embedding_model import get_model

SEMANTIC_WEIGHT = 0.7
TFIDF_WEIGHT = 0.3


def _tfidf_scores(skills_text, descriptions):
    if not skills_text.strip():
        return [0.0] * len(descriptions)

    corpus = [skills_text] + descriptions
    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform(corpus)
    except ValueError:
        # Empty vocabulary (e.g. descriptions/skills contain only stop words).
        return [0.0] * len(descriptions)

    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])[0]
    return similarities.tolist()


def compute_match_scores(skills, jobs):
    """
    skills: list of extracted skill strings, e.g. ["python", "react", ...]
    jobs: list of dicts like [{ "id": "123", "description": "..." }, ...]

    Combines sentence-transformer embedding similarity (semantic match) with
    TF-IDF cosine similarity (keyword overlap) into one confidence score
    (0-100), and returns jobs sorted best-match first.
    """
    if not jobs:
        return []

    skills_text = " ".join(skills) if skills else ""
    descriptions = [job["description"] for job in jobs]

    model = get_model()
    skills_embedding = model.encode(skills_text, convert_to_tensor=True)
    job_embeddings = model.encode(descriptions, convert_to_tensor=True)
    semantic_scores = util.cos_sim(skills_embedding, job_embeddings)[0].tolist()

    tfidf_scores = _tfidf_scores(skills_text, descriptions)

    results = []
    for i, job in enumerate(jobs):
        semantic = max(0.0, semantic_scores[i])
        tfidf = max(0.0, float(tfidf_scores[i]))
        confidence = semantic * SEMANTIC_WEIGHT + tfidf * TFIDF_WEIGHT

        results.append(
            {
                "jobId": job["id"],
                "score": round(confidence * 100, 2),
                "semanticScore": round(semantic * 100, 2),
                "tfidfScore": round(tfidf * 100, 2),
            }
        )

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
