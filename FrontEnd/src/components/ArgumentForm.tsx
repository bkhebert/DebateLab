import { useState, useRef } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import { FaPaperPlane } from '@react-icons/all-files/fa/FaPaperPlane';
type FactCheckResponse = {
  factCheckedMessage: string;
  factCheckedStatement: string;
};

export default function ArgumentForm() {
  const [argument, setArgument] = useState("");
  const [aiResponse, setAiResponse] = useState<FactCheckResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) return;
    aiFactChecker(argument.trim());
    // You can send the argument to your backend here.
    console.log("Submitted argument:", argument);
    setSubmitted(true);

  };

  // Auto expand textarea height up to 4 rows
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setArgument(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      const maxHeight = 4 * 24; // approx 4 rows * 24px line-height
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };
    const aiFactChecker = (argument: string) => {
    axios.post(`${baseURL}/api/ai/fact`, 
      { "message": argument },
       {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
    })
      .then(({ data }) => {
        setAiResponse(data);
        console.log('fact checked data has returned and set to aiRESPOnse')
        console.log(data);
      })
      .catch((error) => {
        console.error('Failed to fact check with AI: ', error);
      });
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4 sm:p-4 md:p-0 md:m-2">
      <label htmlFor="argument" className="block font-exo text-lg">
        Enter your argument for analysis:
      </label>
       {/* <div className="relative w-full max-w-md mx-auto mt-10 bg-red-500">
      <textarea
        id="argument"
        name="argument"
        rows={5}
        value={argument}
        onChange={(e) => setArgument(e.target.value)}
        className="w-full p-3 font-exo border bg-cstmwhite text-cstmblack border-gray-300 dark:bg-cstmblack dark:text-cstmwhite rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Type your argument here..."
      ></textarea>
      <button
        type="submit"
        className="absolute bottom-3 right-3  bg-cstmdarkaccent/80 border-cstmbackground text-white rounded-full hover:bg-primary transition"
      >
        
      <FaPaperPlane size={15} />
      </button>
      </div> */}
      {/* INPUT AREA, ADJUSTABLE */}
      <div className="
          relative 
          w-full 
          max-w-md mx-auto 
          mt-10 
          bg-cstmwhite 
          text-cstmblack
          dark:bg-cstmblack dark:text-cstmwhite
          rounded-lg
          border
          border-cstmgray ">
      <textarea
        id="argument"
        name="argument"
        ref={textareaRef}
        rows={1}
        placeholder="Type your argument here..."
        value={argument}
        onChange={handleChange}
        className="
        font-exo
          w-full
          resize-none
          rounded-lg
          outline-none
          bg-transparent
          text-cstmblack
          dark:text-cstmwhite
          p-4
          pr-2  /* enough padding for the button */
          mb-8
          placeholder:text-cstmgray
          focus:outline-none
          transition-all
          duration-150
          ease-in-out
          overflow-y-hidden
        "
      />

      <button
        type="submit"
        className="
          absolute
          bottom-3
          right-3
          text-primary
          hover:text-cstmgreen
          bg-transparent
          rounded-md
          p-1
          focus:outline-none
          focus:ring-2
          focus:ring-cstmblue
          transition-colors
          duration-150
          ease-in-out
        "
        aria-label="Analyze"
      >
        <FaPaperPlane size={20} />
      </button>
    </div>

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
            <h1 className="text-xl font-bold mb-4">Refactored Message</h1>
            <p className="mb-4">{aiResponse.factCheckedMessage}</p>
            <h1 className="text-xl font-bold mb-4">Reason for Change</h1>
            <p className="mb-4">{aiResponse.factCheckedStatement}</p>
            <div>
              <button
                className="mt-2 text-white px-4 py-2 rounded mr-2 bg-cstmdarkaccent hover:bg-primary"
                onClick={() => { setAiResponse(null); }}
              >
                Back
              </button>
              {/* <button
                className="mt-2 text-white px-4 py-2 rounded bg-blue-primary hover:bg-red-primary"
                
              >
                Submit Updated Reply
              </button> */}
            </div>
          </div>
        }
        </>
  );
}