import ProfileBeliefs from "../components/ProfileBeliefs";
import { useNavigate } from "react-router-dom";
const OnboardingBeliefs = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  }
  return (
    <div>
    <ProfileBeliefs isSelectingTopics={false}/>
    <div className="grid grid-cols-1">
      <button 
      onClick={goHome}
      className="bg-primarylight border-solid border-2 border-primarydark p-3 mt-2">Finish!</button>
      <p className="text-center italic">You can always come back later!</p>
    </div>
    </div>
  )
};

export default OnboardingBeliefs