import "./App.css";
import { useState } from "react";

interface AnalysisResult {
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  suggestions: string[];
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || !url) {
      alert(
        "Please upload your CV and provide a job offer URL before submitting the form."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const cvData = await fetch("http://localhost:8000/api/upload-cv", {
      method: "POST",
      body: formData,
    });
    const data = await cvData.json();

    const offerData = await fetch("http://localhost:8000/api/scrape", {
      method: "POST",
      body: JSON.stringify({ url }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const dataOffer = await offerData.json();

    const matchData = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      body: JSON.stringify({ cv: data.content, offer: dataOffer.content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const matchResult = await matchData.json();
    setResult(matchResult.result);
    setLoading(false);
  };

  return (
    <>
      <h1>Analyze youe job matching</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file_upload">Upload your CV</label>
        <br />
        <input
          type="file"
          id="file_upload"
          name="file_upload"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <br />
        <br />
        <label htmlFor="job_offert">
          Paste link to job offer you are interested in
        </label>
        <br />
        <input
          type="text"
          id="job_offert"
          name="job_offert"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Analyze</button>
      </form>
      <h2>You match results:</h2>
      {loading && <p>Analizuję dopasowanie...</p>}

      {result && (
        <div>
          <h2>Dopasowanie: {result.match_percentage}%</h2>
          <h3>Posiadane umiejętności:</h3>
          <ul>
            {result.matched_skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
          <h3>Brakujące umiejętności:</h3>
          <ul>
            {result.missing_skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
          <h3>Sugestie:</h3>
          <ul>
            {result.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default App;
