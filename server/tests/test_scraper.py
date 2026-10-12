from services.scraper import scrape_html

def test_scrape_html():
    url = "https://www.example.com"
    result = scrape_html(url)
    assert isinstance(result, str)
    assert len(result) > 0

def test_scrape_html_invalid_url():
    url = "https://www.invalid-url-example.com"
    result = scrape_html(url)
    assert isinstance(result, str)
    assert "Error scraping the URL" in result

def test_scrape_html_with_script_and_style():
    url = "https://www.example.com/with-script-and-style"
    result = scrape_html(url)
    assert isinstance(result, str)
    assert "<script>" not in result
    assert "<style>" not in result