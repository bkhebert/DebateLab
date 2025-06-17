import AnalyzerCard from "./AnalyzerCard"
import Feed from "./Feed"
import { Separator } from "@radix-ui/react-separator"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const MobileLayout = ({topic}) => {
  console.log(topic)
    const [showAnalyzer, setShowAnalyzer] = useState(false);
  const toggleAnalyzer = () => setShowAnalyzer(!showAnalyzer);
  const navigate = useNavigate();
  const toTopics = () => {
    console.log('hello')
    navigate('/debates')
  }

  useEffect(() => {
    
  }, [topic])
  return (
        
      <main className="col-span-1 lg:col-span-8 lg:px-4 h-screen overflow-y-auto pb-16">
        {/* Argument Input */}
        <div className="mt-1 mx-2 flex items-center gap-2 px-4 py-3 bg-white rounded-xl shadow-sm shadow-primary border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
          onClick={toggleAnalyzer}>
          <img
            src="/public/anonprofile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          { !topic && <span className="text-gray-500 text-sm">Enter an argument for analysis here...</span>}
           { topic && <span className="text-gray-500 text-sm">Submit a post for debate in {topic}?</span>}
        </div>

        {showAnalyzer && (
          <div className='absolute top-0 right-0 left-0 bg-cstmblack/50 h-full z-50'>
            <div className="lg:top-4">
            <AnalyzerCard closeModal={() => setShowAnalyzer(false)} topic={topic} showLogo={true} showExit={true} isDemo={false}/>
            </div>
          </div>
        )}

        {/* Donation */}
        <div className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">
          Debate App Powered By A.I.
        </div>
     
        <Separator className="mt-2 mb-2 bg-cstmblack" />
          { !topic && <div className="flex justify-center mt-3">
          <button 
          onClick={toTopics}
          className="bg-white text-primary border-solid border-2 border-primary/70 p-2 rounded-full">Choose A Debate Topic</button>
        </div>}
        <h6 className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">Recent debates{topic? ` on ${topic}`: ""}</h6>
        
        {/* Feed (scrollable) */}
        <Feed topic={topic} />
      </main>
  )
}

export default MobileLayout