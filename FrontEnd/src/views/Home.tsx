import { useState, useEffect } from "react";
import AnalyzerCard from "../components/AnalyzerCard";
function Home() {
  const [showAnalyzer, setShowAnalyzer] = useState(false);

  const toggleAnalyzer = () => {
    setShowAnalyzer(!showAnalyzer);
  }
 return (
  <div className=''>
    <div className="mt-1 mx-2 flex items-center gap-2 px-4 py-3 bg-cstmwhite rounded-xl shadow-sm border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
     onClick={toggleAnalyzer}
>
  <img
    src="/public/anonprofile.png"
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover"
  />
  <span className="text-gray-500">Enter any argument for analysis...</span>
</div>
    {showAnalyzer && 
    <div className='absolute top-0 right-0 left-0 bg-cstmblack/50 h-full'>
    <AnalyzerCard  closeModal={() => setShowAnalyzer(false)}/>
    </div>
    }
      <div className="flex justify-center mt-4 md:mt-12">
          {/* <a href='/About'>About</a> */}
      <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-yellow-400/80 hover:bg-cstmgold text-cstmblack font-bold py-2 px-4 rounded"
      >
        Analyze
      </a>
      </div>
    </div>
  )
}

export default Home;