from pypdf import PdfReader
from fastapi import UploadFile, File, FastAPI
from routes.cv import router as cv_router

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(cv_router, prefix="/api")