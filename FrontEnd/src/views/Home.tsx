import { useState, useEffect } from "react";
import AnalyzerCard from "../components/AnalyzerCard";
import { Separator } from "../components/ui/Separator";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft"
import Feed from "../components/Feed";

function Home() {
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const toggleAnalyzer = () => setShowAnalyzer(!showAnalyzer);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen">
      {/* Left Sidebar */}
      <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
        <nav className="space-y-4 text-sm text-gray-700">
          <a href="#" className="block hover:text-black">Home</a>
          <a href="#" className="block hover:text-black">Profile</a>
          <a href="#" className="block hover:text-black">Settings</a>
          <a href="#" className="block hover:text-black">Logout</a>
        </nav>
      </aside>

      {/* Main Scrollable Content */}
      <main className="col-span-1 lg:col-span-8 lg:px-4 h-screen overflow-y-auto px-4 pb-16">
        {/* Argument Input */}
        <div className="mt-1 mx-2 flex items-center gap-2 px-4 py-3 bg-cstmwhite rounded-xl shadow-sm border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
          onClick={toggleAnalyzer}>
          <img
            src="/public/anonprofile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gray-500 text-sm">Enter any argument for analysis...</span>
        </div>

        {showAnalyzer && (
          <div className='absolute top-0 right-0 left-0 bg-cstmblack/50 h-full z-50'>
            <AnalyzerCard closeModal={() => setShowAnalyzer(false)} />
          </div>
        )}

        {/* Donation */}
        <div className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">
          Debate App Powered By A.I.
        </div>

        <Separator className="mt-2 mb-2 bg-cstmblack" />
        <h6 className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">Recent Debates</h6>
        {/* Feed (scrollable) */}
        <Feed />
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Trending Topics</h2>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>#FreeSpeech</li>
          <li>#LogicalFallacies</li>
          <li>#Philosophy</li>
          <li>#Politics</li>
        </ul>
      </aside>
    </div>
  );
}


export default Home;