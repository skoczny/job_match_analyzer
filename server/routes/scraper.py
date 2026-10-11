from fastapi import APIRouter
from services.scraper import scrape_html
from pydantic import BaseModel

router = APIRouter()

class ScrapeRequest(BaseModel):
    url: str

@router.post("/scrape")
async def scrape(url: ScrapeRequest):
    try:
        text = scrape_html(url)
        return {"url": url, "content": text}
    except Exception as e:
        return {"error": str(e)}