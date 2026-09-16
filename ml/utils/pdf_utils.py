import pdfplumber
import docx

def extract_text(file_path):
    file_extension = file_path.lower()

    if file_extension.endswith(".pdf"):
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += (page.extract_text() or "") + "\n"
        return text

    elif file_extension.endswith(".docx"):
        doc = docx.Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)

    else:
        raise ValueError("Unsupported file type")