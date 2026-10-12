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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Job Match Analyzer
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg mb-8 flex flex-col gap-4"
        >
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="file_upload">
              Upload your CV (PDF)
            </label>
            <input
              type="file"
              id="file_upload"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer hover:file:bg-blue-700"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1" htmlFor="job_offer">
              Job offer URL
            </label>
            <input
              type="text"
              id="job_offer"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://justjoin.it/job-offer/..."
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {loading && (
          <div className="text-center text-gray-400 animate-pulse text-lg">
            Analyzing your match...
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4">
            <div className="bg-gray-800 p-6 rounded-lg text-center">
              <p className="text-gray-400 text-sm">Match</p>
              <p
                className={`text-5xl font-bold ${
                  result.match_percentage >= 70
                    ? "text-green-400"
                    : result.match_percentage >= 40
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.match_percentage}%
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-green-400 font-semibold mb-2">
                  Matched Skills
                </h3>
                <ul className="flex flex-col gap-1">
                  {result.matched_skills.map((skill, i) => (
                    <li key={i} className="text-gray-300 text-sm">
                      ✓ {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2">
                  Missing Skills
                </h3>
                <ul className="flex flex-col gap-1">
                  {result.missing_skills.map((skill, i) => (
                    <li key={i} className="text-gray-300 text-sm">
                      ✗ {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">Suggestions</h3>
              <ul className="flex flex-col gap-2">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-gray-300 text-sm">
                    → {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
