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
function Home({user}) {

console.log(user)
  return (
    <div>
      {/* Left Sidebar */}


  { !user && <div className="lg:block">
  <DesktopLayout />
  </div>
  }
   <div className={`${user ? "" : "hidden" }`}>
    <MobileLayout/>
    </div>
      {/* Right Sidebar */}

    </div>
  );
}


export default Home;