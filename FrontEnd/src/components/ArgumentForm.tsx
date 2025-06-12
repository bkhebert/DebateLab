import { useState, useRef, useEffect } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import { FaPaperPlane } from '@react-icons/all-files/fa/FaPaperPlane';
import GaugeComponent from "./GaugeComponent";
import FallacyCountComponent from "./FallacyCountComponent";
import FallacyList from "./FallacyList";
import { FaTable } from "react-icons/fa";
import { Loader } from "lucide-react";
type FactCheckResponse = {
  factCheckedMessage: string;
  factCheckedStatement: string;
  listOfFallacies: string[];
};

export default function ArgumentForm() {
  const [argument, setArgument] = useState("");
  const [aiResponse, setAiResponse] = useState<FactCheckResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");
  const [fallacyCount, setFallacyCount] = useState(0);
   const [isLoading, setIsLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const [ progressBar, setProgressBar] = useState(0);
  // const [ progressBarColor, setProgressBarColor] = useState("text-red-500");
  // const [ progressReached, setProgressReached] = useState(false);
  // const progIntervalRef = useRef(null);
  // const progRef = useRef({ value: 0});
  const [percentage, setPercentage] = useState(75);
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
    setIsLoading(true);
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
        setPercentage(data.percentage);
        setFallacyCount(data.listOfFallacies.length);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fact check with AI: ', error);
      });
  };

  return (
    <div className="p-2">
    <form onSubmit={handleSubmit} className="space-y-4 sm:p-4 md:p-0 md:m-2">

      {/* INPUT AREA, ADJUSTABLE */}
     { !aiResponse && !isLoading && <div className="
          relative 
          w-full 
          max-w-md mx-auto 
          mt-1
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
        placeholder="Type your argument for analysis here..."
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
          pr-8  /* enough padding for the button */
          mb-10
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
          bottom-1
          right-1
          text-primarylight
          hover:text-cstmprimary
          bg-cstmdarkaccent
          rounded-full
          p-2
          focus:outline-none
          focus:ring-2
          focus:ring-cstmwhite
          transition-colors
          duration-150
          ease-in-out
        "
        aria-label="Analyze"
      >
        <FaPaperPlane size={20} />
      </button>
    </div> }

      {submitted && (
        <div className="mt-4 text-cstmblack dark:text-cstmwhite text-center font-semibold font-exo">
          Argument submitted for analysis!
        </div>
      )}
      {
        isLoading &&
        <div className="flex justify-center items-center h-64">
          <Loader className="w-12 h-12 text-blue-primary animate-spin" />
        </div>
      }
    </form>
    {
        // AI Response
        aiResponse &&
          <div className="flex grid grid-cols-2 mt-4 mb-4 bg-primarylight/70 dark:bg-primarylight/50 rounded-lg">
            <div>
              <GaugeComponent percentage={percentage}/>
            </div>
            <div>

              <FallacyCountComponent fallacyCount={fallacyCount}/>
              </div>
              <div className="col-span-2 bg-cstmblack m-3 font-mono text-cstmwhite">
              <FallacyList arrayOfFallacies={aiResponse.listOfFallacies} />
            <div className="col-span-2">
            <h1 className="text-xl font-bold mb-4 text-center font-mono">Original Message</h1>
            <p className="mb-4 text-center">{argument}</p>
            </div>
            <div className="col-span-2">
            <h1 className="text-xl font-bold mb-4 text-center font-mono">Refactored Message</h1>
            <p className="mb-4 text-center">{aiResponse.factCheckedMessage}</p>
            </div>
            <div className="col-span-2 md:col-span-1 font-mono">
            <h1 className="text-xl font-bold mb-4 text-center font-mono">Reason for Change</h1>
            <p className="mb-4 text-center">{aiResponse.factCheckedStatement}</p>
            </div>
            
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                className="mt-2 mb-2 text-white px-4 py-2 rounded mr-2 bg-cstmdarkaccent hover:bg-primary"
                onClick={() => { setAiResponse(null); }}
              >
                Back
              </button>
            </div>
          </div>
        }
        </div>
  );
}