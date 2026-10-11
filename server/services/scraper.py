import httpx
from bs4 import BeautifulSoup

def scrape_html(url: str) -> str:
    try:
        response = httpx.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        text = soup.get_text()
        return text
    except Exception as e:
        return f"Error scraping the URL: {str(e)}"
