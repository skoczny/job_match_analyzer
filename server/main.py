from fastapi import FastAPI
from routes.cv import router as cv_router
from routes.analyze import router as analyze_router
import os 

print("GEMINI KEY:", os.getenv("GEMINI_API_KEY", "NOT SET"))

app = FastAPI()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(cv_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")