import google.generativeai as genai
import os
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.8-flash")

def matching_analyze(offer, cv):
    """
    Analyzes the matching between a job offer and a CV using Google Gemini API.

    Parameters:
    - offer (str): The job offer text.
    - cv (str): The CV text.

    Returns:
    - dict: A dictionary containing the analysis result.
    """
    prompt = f"""Porównaj poniższe CV z ofertą pracy. 
        Odpowiedz WYŁĄCZNIE jako JSON, bez żadnego dodatkowego tekstu:
        {{
            "match_percentage": liczba 0-100,
            "matched_skills": ["umiejętności które kandydat ma"],
            "missing_skills": ["umiejętności których brakuje"],
            "suggestions": ["konkretne sugestie co dodać do CV"]
        }}

        CV:
        {cv}

        Oferta pracy:
        {offer}"""
    
    response = model.generate_content(prompt)
    return json.loads(response.text)
    
