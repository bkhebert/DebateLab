import { Separator } from "../components/ui/Separator";
import AnalyzerCard from "../components/AnalyzerCard";
import Feed from "../components/Feed";
import { IconCloudDemo } from "../components/ui/IconCloudDemo";
import MagicBoxIntro from "../components/MagicBoxIntro";

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
     <MagicBoxIntro/>

      
      
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