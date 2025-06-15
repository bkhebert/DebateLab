import { Separator } from "../components/ui/Separator";
import AnalyzerCard from "../components/AnalyzerCard";
import Feed from "../components/Feed";
import { Link } from "react-router-dom";
import { IconCloudDemo } from "../components/ui/IconCloudDemo";
const DesktopLayout = () => {
  const handleclose = () => {
    return null;
  }
  return (
   

      <div className="relative">
        <div className="absolute top-2 left-3/7 opacity-20">
        <IconCloudDemo />
        </div>
  {/* Top section: Intro + Analyzer */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-12 max-w-7xl mx-auto">
    {/* Left 2/3: Intro content */}
    <div className="lg:col-span-2 flex flex-col justify-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Welcome to <span className="text-cstmblack">Debate Labs</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
        Debate Labs is a modern platform where you can test your arguments, debate others, 
        and get real-time analysis powered by AI. Whether you're sharpening your logic, 
        sparking a conversation, or trying to logically check yourself before you fallaciously wreck yourself  — we've got you covered.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/signup">
          <button className="bg-cstmblack text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
            Sign up & Join the Debate
          </button>
        </Link>
        <Link to="/demo">
          <button className="border border-cstmblack text-cstmblack px-8 py-3 rounded-full hover:bg-gray-50 transition-all">
            Try Demo
          </button>
        </Link>
      </div>
    </div>

    {/* Right 1/3: Try it now card */}
    <div className="flex items-center justify-center lg:justify-end">
      <div className="w-full max-w-md">
        <AnalyzerCard closeModal={handleclose} />
      </div>
    </div>
  </div>

  {/* Feed section */}
  <div className="px-6 lg:px-12 py-12 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
        Recent Debates & Analyzed Arguments
      </h2>
      <div className="space-y-6">
        <Feed />
      </div>
    </div>
  </div>
</div>
   
    // <div className="grid grid-cols-3 grid-rows-5 bg-red-400 w-full">
    //   <div className="flex justify-center col-span-2 row-span-3 bg-blue-400">What is Debate Labs?</div>
    //   <div className="flex justify-center col-span-1 row-span-3 bg-yellow-300"></div>

    //   <div className="flex justify-center col-span-3 row-span-2 bg-green-300">
    //     <Separator className="bg-black"/>
    //   </div>
    // </div>
  )
}

export default DesktopLayout;