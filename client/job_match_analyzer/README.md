# Job Match Analyzer

An AI-powered tool that compares your CV against job offers and provides a detailed compatibility report. Upload your CV as a PDF, paste a job offer URL, and get instant feedback on your match percentage, matched and missing skills, and actionable suggestions to improve your CV.

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Python, FastAPI  
**AI:** Google Gemini API  
**Infrastructure:** Docker, docker-compose  
**Testing:** pytest  
**CI/CD:** GitHub Actions

## Features

- PDF upload and text extraction from CV
- Job offer scraping from URL (JustJoin.it, No Fluff Jobs, etc.)
- AI-powered analysis comparing CV against job requirements
- Match percentage with color-coded indicator
- Matched skills and missing skills breakdown
- Actionable suggestions for CV improvement
- Containerized with Docker for one-command setup
- Automated testing on every push via GitHub Actions

## Project Structure

```
├── .github/
│   └── workflows/
│       └── tests.yml          # CI pipeline
│
├── client/                    # React frontend
│   └── src/
│       └── App.tsx            # Upload form + results display
│
└── server/                    # FastAPI backend
    ├── main.py                # Server entry point, CORS, routers
    ├── Dockerfile
    ├── docker-compose.yml
    ├── routes/
    │   ├── cv.py              # PDF upload and text extraction
    │   ├── analyze.py         # CV vs offer analysis via Gemini
    │   └── scraper.py         # Job offer URL scraping
    ├── services/
    │   ├── analyzer.py        # Gemini API integration
    │   └── scraper.py         # HTML scraping with BeautifulSoup
    └── tests/
        └── test_scraper.py    # Unit tests
```

## Getting Started

### Prerequisites

- Docker
- Node.js 18+

### Backend

```bash
cd server
```

Create `server/.env`:

```
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgresql://postgres:postgres@db:5432/job_match
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com).

```bash
docker compose up --build
```

Backend runs on `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

| Method | Endpoint         | Description                                   |
| ------ | ---------------- | --------------------------------------------- |
| GET    | `/health`        | Server health check                           |
| POST   | `/api/upload-cv` | Upload PDF, returns extracted text            |
| POST   | `/api/scrape`    | Scrape job offer from URL                     |
| POST   | `/api/analyze`   | Compare CV text with offer text via Gemini AI |

## How It Works

1. **Upload** — user uploads their CV as a PDF file, the server extracts text using pypdf
2. **Scrape** — user pastes a job offer URL, the server fetches the page and extracts text using BeautifulSoup and httpx
3. **Analyze** — both texts are sent to Google Gemini with a structured prompt that returns a JSON report with match percentage, matched/missing skills, and improvement suggestions
4. **Display** — frontend renders the analysis in a clean, color-coded dashboard

## Architecture Decisions

- **FastAPI over Django** — lightweight, async-first, built-in OpenAPI docs, ideal for an API-focused service with no server-side rendering needs.
- **Gemini API for analysis** — instead of building keyword-matching logic manually, leveraging an LLM provides contextual understanding (e.g., "worked with databases" matches "SQL requirement") and actionable suggestions.
- **BeautifulSoup + httpx for scraping** — simple, well-documented stack for HTML parsing without the overhead of a headless browser.
- **Docker from day one** — ensures consistent environments across development and production; one command to start the entire stack.
- **pytest + GitHub Actions** — automated quality gate; every push runs tests before code reaches production.

## Running Tests

```bash
cd server
uv run pytest
```

Tests also run automatically on every push via GitHub Actions.
