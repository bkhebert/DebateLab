import { useState } from "react";
import axios from "axios";

type FactCheckResponse = {
  factCheckedMessage: string;
  factCheckedStatement: string;
};

export default function ArgumentForm() {
  const [argument, setArgument] = useState("");
  const [aiResponse, setAiResponse] = useState<FactCheckResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) return;
    aiFactChecker(argument.trim());
    // You can send the argument to your backend here.
    console.log("Submitted argument:", argument);
    setSubmitted(true);

  };

    const aiFactChecker = (argument: string) => {
    axios.post('http://localhost:3000/api/ai/fact', {
      message: argument,
    })
      .then(({ data }) => {
        setAiResponse(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Failed to fact check with AI: ', error);
      });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <label htmlFor="argument" className="block text-lg font-medium">
        Enter your argument for analysis:
      </label>
      <textarea
        id="argument"
        name="argument"
        rows={5}
        value={argument}
        onChange={(e) => setArgument(e.target.value)}
        className="w-full p-3 border bg-cstmwhite text-cstmblack border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your argument here..."
      ></textarea>
      <button
        type="submit"
        className="px-6 py-2 bg-cstmdarkaccent border-cstmbackground text-white rounded-xl hover:bg-primary transition"
      >
        Analyze
      </button>

      {submitted && (
        <div className="mt-4 text-green-600 font-semibold">
          Argument submitted for analysis!
        </div>
      )}
    </form>
    {
        // AI Response
        aiResponse &&
          <div className="mt-4 mb-4">
            <h1 className="text-xl font-bold mb-4">Updated Reply to Post</h1>
            <p className="mb-4">{aiResponse.factCheckedMessage}</p>
            <h1 className="text-xl font-bold mb-4">Reason for Change</h1>
            <p className="mb-4">{aiResponse.factCheckedStatement}</p>
            <div>
              <button
                className="mt-2 text-white px-4 py-2 rounded mr-2 bg-blue-primary hover:bg-red-primary"
                onClick={() => { setAiResponse(null); }}
              >
                Back to the Drawing Board
              </button>
              <button
                className="mt-2 text-white px-4 py-2 rounded bg-blue-primary hover:bg-red-primary"
                
              >
                Submit Updated Reply
              </button>
            </div>
          </div>
        }
        </>
  );
}