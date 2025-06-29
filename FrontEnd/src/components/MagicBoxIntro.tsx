import { BoxReveal } from "./ui/BoxReveal";
import { Button } from "./ui/Button";
import { Link } from "react-router-dom";
import { Rainbowbutton } from "./ui/rainbowbutton";
import { ShimmerButton } from "./ui/ShimmerButton";
const MagicBoxIntro = () => {

  return (
     <div className="size-full max-w-xl items-center justify-center overflow-hidden pt-8  ">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
      <div className="inline-block bg-cstmwhite/80 dark:bg-white-100/40 p-3 rounded-xl dark:border-solid dark:border-2 dark:border-primarylight/80 md:border-cstmwhite">
            <img
              src={`/debatelabblack.png`}
              alt="DebateLab Logo"
              className="w-32 md:w-80 mx-aut"
            />
          </div>
      </BoxReveal>
 
      <BoxReveal boxColor={"#2B2E44"} duration={0.5}>
        <h2 className="mt-[1rem] text-[1rem] italic dark:text-white">
          Debate app, powered by {" "}
          <span className="text-[#A128E3] shadow  shadow-lg dark:shadow-primarylight/20">A.I.</span>
        </h2>
          <h2 className="text-xl md:text-2xl text-center italic text-gray-700 mt-1 dark:text-neonBlue ">
          End Widespread Ignorance.
        </h2>
      </BoxReveal>
 
      <BoxReveal boxColor={"#2B354B"} duration={0.5}>
        <div className="mt-3 mr-2">
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed dark:text-white">
        Debate Labs is a modern platform where you can test your arguments, debate others, 
        and get real-time analysis powered by AI. </p>
        </div>
        </BoxReveal>
        <BoxReveal boxColor={"#2B4747"} duration={0.5}>
          
        <p className="mt-1 mb-1 text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed dark:text-white">
        Whether you're sharpening your logic, 
        sparking a conversation, or trying to logically check yourself before you fallaciously wreck yourself  — we've got you covered.
      
            {/* <span className="font-semibold text-[#5046e6]">React</span>,
            <span className="font-semibold text-[#5046e6]">Typescript</span>,
            <span className="font-semibold text-[#5046e6]">Tailwind CSS</span>,
            and
            <span className="font-semibold text-[#5046e6]">Motion</span> */}
            {/* . <br />
            -&gt; 100% open-source, and customizable. <br /> */}
          </p>
     
      </BoxReveal>
 
      <BoxReveal boxColor={"#A128E3"} duration={0.5}>
        <div className="mt-2 flex flex-col sm:flex-row gap-4  p-8">
        <Link to="/signup">
          <Rainbowbutton className="text-white px-8 py-3 bg-primary rounded-full hover:bg-opacity-90 transition-all duration-2000 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
            Sign up & Join the Debate
          </Rainbowbutton>
        </Link>
        <Link to="/demo">
          <ShimmerButton className="text-white bg-primary dark:text-white">
            Explore
          </ShimmerButton>
        </Link>
      </div>
      </BoxReveal>
    </div>
  )
}

export default MagicBoxIntro;