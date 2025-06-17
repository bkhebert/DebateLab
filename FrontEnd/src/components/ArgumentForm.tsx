/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import { FaArrowRight } from '@react-icons/all-files/fa/FaArrowRight';
import GaugeComponent from "./GaugeComponent";
import FallacyCountComponent from "./FallacyCountComponent";
import FallacyList from "./FallacyList";
import { FaTable } from "react-icons/fa";
import { Loader } from "lucide-react";
import { ShimmerButton } from "./ui/ShimmerButton";
import useAuth from "../contexts/useAuth";
type FactCheckResponse = {
  factCheckedMessage: string;
  factCheckedStatement: string;
  listOfFallacies: string[];
  closeModal: any;
};

export default function ArgumentForm({topic, isDemo, closeModal}) {
  
  const MAX_CHAR_LIMIT = 500;
  const { user } = useAuth();
  const [argument, setArgument] = useState("");
  const [aiResponse, setAiResponse] = useState<FactCheckResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");
  const [fallacyCount, setFallacyCount] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
  const [limitColor, setLimitColor] = useState('text-cstmred')
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
    const newText = e.target.value;

    if (newText.length > MAX_CHAR_LIMIT) return;
    setText(e.target.value);
    setArgument(e.target.value)
  // Set color thresholds
  if (newText.length > 420) {
    setLimitColor("text-cstmred"); // Very close to max
  } else if (newText.length > 250) {
    setLimitColor("text-primary"); // Midway
  } else {
    setLimitColor("text-cstmgray"); // Default
  }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
      const maxHeight = 4 * 24; // approx 4 rows * 24px line-height
      const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY = textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
    }
  };

  const acceptOriginalPost = (topic) => {
    if(topic === null){
      topic = "The Great Conversation";
    }
    axios.post(`${baseURL}/api/message/`,  {
      content: {
        argument,
        fallacies: aiResponse.listOfFallacies.length > 0 ? aiResponse.listOfFallacies : [],
        user,
      },
        topic,
        userId: user? user.id : null,
    }).then((result) => {
      console.log('success' , result);
       setAiResponse(null);
      if(!isDemo)
        {closeModal();}
    }).catch((err) => {
      console.error(err);
    })
  }

  const acceptRevisedPost = (topic) => {
    if(topic === null){
      topic = "The Great Conversation";
    }
        axios.post(`${baseURL}/api/message/`,  {
      content: {
        argument,
        fallacies: [],
        user,
      },
        topic,
        userId: user? user.id : null,
    }).then((result) => {
      console.log('success' , result);
      setAiResponse(null);
      if(!isDemo) {
      closeModal();
      }
    }).catch((err) => {
      console.error(err);
    })
  }
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
    <div className={`p-1 ${isDemo ? 'mt-2' : ''}`}>
      <div className={`p-1 ${isDemo ? 'overflow-y-scroll max-h-[50vh]' : ''}`}>
    <form onSubmit={handleSubmit} className="space-y-4 sm:p-4 md:p-0 md:m-2">

      {/* INPUT AREA, ADJUSTABLE */}
     { !aiResponse && !isLoading && <div className={`
          relative 
          ${isDemo ? "w-full" : "w-full max-w-md"}
           mx-auto 
          mt-1
          bg-cstmwhite 
          text-cstmblack
          dark:bg-cstmblack dark:text-cstmwhite
          rounded-lg
          border
          border-cstmgray `}>
      <textarea
        id="argument"
        name="argument"
        ref={textareaRef}
        rows={4}
        placeholder={`Type your argument ${topic ? `on ${topic} for` :"for"}  analysis here...`}
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
          text-lg
          placeholder:text-cstmgray
          focus:outline-none
          transition-all
          duration-150
          ease-in-out
          overflow-y-hidden
        "
      />
      <p className={`text-xs text-center mx-auto pt-8 bg-primarydark/10 ${limitColor}`}>
        {argument.length}/{MAX_CHAR_LIMIT} characters
      </p>
      <ShimmerButton
        type="submit"
        className={`
          absolute
          bottom-1
          right-1
          text-primarylight
          hover:text-cstmprimary
          bg-cstmdarkaccent/90
          rounded-full
          p-2
          focus:outline-none
          focus:ring-2
          focus:ring-cstmwhite
          transition-colors
          duration-150
          ease-in-out
          ${argument.length > MAX_CHAR_LIMIT ? "opacity-50 cursor-not-allowed" : ""}
        `}
        aria-label="Analyze"
         disabled={argument.length > MAX_CHAR_LIMIT}
      >
        <FaArrowRight className="text-cstmwhite"size={20} />
      </ShimmerButton>
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
          <div className="flex grid grid-cols-2 mt-4 mb-4 bg-cstmneutral/70 dark:bg-primarylight/50 rounded-lg border border-primary">
            <div className="flex mx-auto">
              <GaugeComponent percentage={percentage}/>
            </div>
            <div>

              <FallacyCountComponent fallacyCount={fallacyCount}/>
              </div>
              <div className="col-span-2 bg-cstmblack m-3 font-mono text-cstmwhite rounded-md">
              <FallacyList arrayOfFallacies={aiResponse.listOfFallacies} isDemo={isDemo} />
            <div className="col-span-2">
            <h1 className={`text-xl font-bold mt-2 mb-4 text-center font-mono text-cstmred md:text-2xl ${isDemo ? 'lg:text-sm ' : ''}`}>Original Message</h1>
            <p className={`p-4 text-center text-xs italic text-red-200 md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>{argument}</p>
            </div>
            <div className="col-span-2">
            <h1 className={`text-xl font-bold mb-4 text-center font-mono text-cstmgreen md:text-2xl ${isDemo ? 'lg:text-sm ' : ''}`}>Refactored Message</h1>
            <p className={`p-4 text-center italic text-xs text-cstmgreen md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>{aiResponse.factCheckedMessage}</p>
            </div>
            <div className="col-span-2 md:col-span-1 font-mono">
            <h1 className={`text-xl font-bold mb-4 text-center font-mono md:text-2xl ${isDemo ? 'lg:text-sm ' : ''}`}>Reason for Change</h1>
            <p className={`mb-4 text-center md:text-xl ${isDemo ? 'lg:text-sm ' : ''}`}>{aiResponse.factCheckedStatement}</p>
            </div>
            
            </div>
            <div className="col-span-2 flex justify-center">
              <button
                className="mt-2 mb-2 text-white px-4 py-2 rounded mr-2 bg-cstmdarkaccent hover:bg-primary"
                onClick={() => { setAiResponse(null); }}
              >
                Back
              </button>
              <button
                className="mt-2 mb-2 text-white px-4 py-2 rounded mr-2 bg-cstmdarkaccent hover:bg-primary"
                onClick={() => { acceptOriginalPost(topic); }}
              >
                Accept Original Post
              </button>
              <button
                className="mt-2 mb-2 text-white px-4 py-2 rounded mr-2 bg-cstmdarkaccent hover:bg-primary"
                onClick={() => { acceptRevisedPost(topic); }}
              >
                Accept Revised Post
              </button>
            </div>
          </div>
        }
        </div>
        </div>
  );
}