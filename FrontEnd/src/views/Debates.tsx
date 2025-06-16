import DisclaimerCard from "../components/Disclaimer"
import { useState } from "react";
import ProfileBeliefs from "../components/ProfileBeliefs";
const Debates = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const toggleDisclaimer = () => {
    setShowDisclaimer(false);
  }

  const toggleCountCool = () => {
    console.log("Cool counted");
  }
   const toggleCountHoly = () => {
    console.log("Holy counted");
  }
   const toggleCountAsshole = () => {
    console.log("Asshole counted");
  }
  return (
    <div>
   { showDisclaimer &&
    <div  onClick={toggleDisclaimer}>
    <div>
        <DisclaimerCard/>
        <div className="grid grid-cols-3 gap-2 mt-1">
        <button onClick={toggleCountCool}className="bg-cstmgreen rounded p-3">chillout brah i gotchu</button>
        <button onClick={toggleCountHoly} className="bg-cstmblue rounded p-3">Understood I will be respectful</button>
        <button onClick={toggleCountAsshole} className="bg-cstmred text-white rounded p-3">Hell no I am toxic</button>
        </div>
        </div>
    </div>
    }
    <ProfileBeliefs isSelectingTopics={true}/>
   <div className="text-center text-primary"> The best way to use this app is to be honest about who you are and what you believe in.</div>
    </div>
  )
}
export default Debates;