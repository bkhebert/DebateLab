import ProfileBeliefs from "../components/ProfileBeliefs";
import { useNavigate } from "react-router-dom";
const OnboardingBeliefs = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  }
  return (
    <div>
    <ProfileBeliefs isSelectingTopics={false} topicChosen={false} feedtopic={false}/>
    <div className="grid grid-cols-1">
      <button 
      onClick={goHome}
      className="my-2 mx-2 font-sans bg-gradient-to-r from-purple-900 to-indigo-800 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 ease-in-out"
      >Finish!</button>
      <p className="text-center italic">You can always come back later!</p>
    </div>
    </div>
  )
};

export default OnboardingBeliefs