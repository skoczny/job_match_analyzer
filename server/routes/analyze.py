from fastapi import APIRouter
from pydantic import BaseModel
from services.analyzer import matching_analyze

router = APIRouter()

class AnalyzeRequest(BaseModel):
    offer: str
    cv: str

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        result = matching_analyze(request.offer, request.cv)
        return {"result": result}
    except Exception as e:
        return {"error": str(e)}


