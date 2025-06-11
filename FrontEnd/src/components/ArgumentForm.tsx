import { useState, useRef, useEffect } from "react";
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
  const [ progressBar, setProgressBar] = useState(0);
  const [ progressBarColor, setProgressBarColor] = useState("text-red-500");
  const [ progressReached, setProgressReached] = useState(false);
  const progIntervalRef = useRef(null);
  const progRef = useRef({ value: 0});

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

    useEffect(() => {

    if(!progressReached){
    progIntervalRef.current = setInterval(() => {
      const p = progRef.current;
     
      if(p.value === 25){
        setProgressBarColor('text-yellow-500')
      }
      if(p.value === 60){
        setProgressBarColor('text-green-500')
      }


      if(p.value < 75) {
        p.value += 1
        
      }

      setProgressBar(p.value)
      if(p.value === 75){

        setProgressReached(true);
        setProgressBarColor('text-cyan-500')
      }
    }, 300);
  }

    if(progressReached){
      clearInterval(progIntervalRef.current);
    
    }

    return (() => {
      clearInterval(progIntervalRef.current);
    });

  }, [progressReached])

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
    <div className="p-2">
    <form onSubmit={handleSubmit} className="space-y-4 sm:p-4 md:p-0 md:m-2">

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
          <div className="flex grid grid-cols-2 mt-4 mb-4 bg-green-300/50">
            <div>
              <div className="relative size-40" >
                <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-white" strokeWidth="1" strokeDasharray="75 100"></circle>
                  <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${progressBarColor}`} strokeWidth="2" strokeDasharray={`${Math.floor(progRef.current.value)} 100`}></circle>
                </svg>

                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-2xl font-semibold text-blue-50">{Math.floor(progRef.current.value / .75)} %</span>
                  <span className="text-cyan-50 font-bold block">completed</span>
                </div>
            </div>
            </div>
            <div className="col-span-2">
            <h1 className="text-xl font-bold mb-4 text-center">Refactored Message</h1>
            <p className="mb-4 text-center">{aiResponse.factCheckedMessage}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
            <h1 className="text-xl font-bold mb-4">Reason for Change</h1>
            <p className="mb-4">{aiResponse.factCheckedStatement}</p>
            </div>
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
        </div>
  );
}