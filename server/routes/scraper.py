from fastapi import APIRouter
from services.scraper import scrape_html

router = APIRouter()

@router.get("/scrape")
async def scrape(url: str):
    try:
        text = scrape_html(url)
        return {"url": url, "content": text}
    except Exception as e:
        return {"error": str(e)}