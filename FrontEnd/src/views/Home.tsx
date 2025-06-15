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
import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "./DesktopLayout";
function Home() {

  const user = false;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 h-screen">
      {/* Left Sidebar */}
{user &&  <aside className="hidden lg:block lg:col-span-2 border-r border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
    <nav className="space-y-4 text-sm text-gray-700">
      <a href="#" className="block hover:text-black">Home</a>
      <a href="#" className="block hover:text-black">Profile</a>
      <a href="#" className="block hover:text-black">Settings</a>
      <a href="#" className="block hover:text-black">Logout</a>
    </nav>
  </aside>}
  <div className="hidden lg:block col-span-12 w-full">
  <DesktopLayout />
  </div>
    <div className="lg:hidden">
    <MobileLayout/>
    </div>
      {/* Right Sidebar */}
    {user &&   <aside className="hidden lg:block lg:col-span-2 border-l border-gray-200 p-4 bg-cstmwhite h-screen overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Trending Topics</h2>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>#FreeSpeech</li>
          <li>#LogicalFallacies</li>
          <li>#Philosophy</li>
          <li>#Politics</li>
        </ul>
      </aside> }
    </div>
  );
}


export default Home;