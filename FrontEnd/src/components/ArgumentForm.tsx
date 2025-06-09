import { useState } from "react";

export default function ArgumentForm() {
  const [argument, setArgument] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) return;

    // You can send the argument to your backend here.
    console.log("Submitted argument:", argument);
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <label htmlFor="argument" className="block text-lg font-medium text-gray-800">
        Enter your argument for analysis:
      </label>
      <textarea
        id="argument"
        name="argument"
        rows={5}
        value={argument}
        onChange={(e) => setArgument(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your argument here..."
      ></textarea>
      <button
        type="submit"
        className="px-6 py-2 bg-primarydark text-white rounded-xl hover:bg-primary transition"
      >
        Analyze
      </button>

      {submitted && (
        <div className="mt-4 text-green-600 font-semibold">
          Argument submitted for analysis!
        </div>
      )}
    </form>
  );
}