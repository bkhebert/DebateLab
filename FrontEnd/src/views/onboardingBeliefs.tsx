import ProfileBeliefs from "../components/ProfileBeliefs";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
const OnboardingBeliefs = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  }
  return (
    <div>
    <ProfileBeliefs isSelectingTopics={false} topicChosen={false} feedtopic={false}/>
    <div className="grid grid-cols-1">
      <Button
      variant="legacyGradient"
      size="menu"
      onClick={goHome}
      className="my-2 mx-2"
      >Finish!</Button>
      <p className="text-center italic">You can always come back later!</p>
    </div>
    </div>
  )
};

export default OnboardingBeliefs