from fastapi import APIRouter, UploadFile, File
from pypdf import PdfReader

router = APIRouter()


@router.post("/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    try:
        pdf_reader = PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        return {"filename": file.filename, "content": text}
    except Exception as e:
        return {"error": str(e)}