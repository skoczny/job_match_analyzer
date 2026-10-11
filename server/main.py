from fastapi import FastAPI
from routes.cv import router as cv_router
from routes.analyze import router as analyze_router
from routes.scraper import router as scraper_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(cv_router, prefix="/api")
app.include_router(analyze_router, prefix="/api")
app.include_router(scraper_router, prefix="/api")