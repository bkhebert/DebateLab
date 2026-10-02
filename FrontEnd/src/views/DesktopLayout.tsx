import AnalyzerCard from "../components/AnalyzerCard";
import { IconCloudDemo } from "../components/ui/IconCloudDemo";
import MagicBoxIntro from "../components/MagicBoxIntro";
import { Marquee3D } from "../components/3DFeed";
const DesktopLayout = () => {
  const handleclose = () => {
    return null;
  }
  return (
   

      <div className="relative">
        <div className="absolute top-1 left-1/4 opacity-20">
        <IconCloudDemo />
        </div>
  {/* Top section: Intro + Analyzer */}
  <div className="grid grid-cols-1 lg:grid-cols-9 gap-8 p-6 lg:p-6 max-w-[90vw] mx-auto">
    {/* Left 2/3: Intro content */}
    <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
     <MagicBoxIntro/>

      
      
    </div>

    {/* Right 1/3: Try it now card */}
    <div className="relative col-span-4">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <Marquee3D>
        </Marquee3D>
      </div>
    <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="">
        <AnalyzerCard closeModal={handleclose} isDemo={true}/>
        </div>
    </div>
  </div>
  </div>
</div>
  )
}

export default DesktopLayout;