import { useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";

const CoverLetterGenerator = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [resume, setResume] = useState("");
  const [jobListing, setJobListing] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setGeneratedLetter(null);

    try {
      const response = await axios.post(
        `${baseURL}/api/generators/coverlettergenerator`,
        {
          resume: resume.trim().slice(0, 8000),
          application: jobListing.trim().replace(/(equal opportunity|eeo|diversity and inclusion)[\s\S]+$/i, '')
          .trim()
          .slice(0, 6600),
        }
      );

      if (response.data?.coverletter) {
        setGeneratedLetter(response.data.coverletter);
      } else {
        setError("No cover letter returned. Please try again.");
      }
    } catch (err) {
      setError("Failed to generate cover letter.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Cover Letter Generator</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />

        <input
          type="text"
          placeholder="Your Contact Info (e.g. email, phone)"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />

        <textarea
          placeholder="Paste your resume here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={8}
          className="w-full border p-2 rounded resize-y text-black"
        />

        <textarea
          placeholder="Paste the job description here..."
          value={jobListing}
          onChange={(e) => setJobListing(e.target.value)}
          rows={6}
          className="w-full border p-2 rounded resize-y text-black"
        />

        <button
          onClick={handleGenerate}
          disabled={loading || !resume || !jobListing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </div>

      {generatedLetter && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-2">Generated Cover Letter</h2>
          <p className="text-gray-700 dark:text-white whitespace-pre-wrap">
            {name && <strong>{name}</strong>}<br />
            {contact && <span>{contact}<br /></span>}
            <br />
            {generatedLetter}
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverLetterGenerator;
