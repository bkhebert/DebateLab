import TagSelector from "../components/TagSelector";
import { useNavigate } from "react-router-dom";
const OnboardingTags = () => {
  const navigate = useNavigate();
  const continueOnboarding =( ) => {
    navigate('/onboarding/beliefs')
  }
  return (
    <div>
        <p className="text-center">Mark the truths that shape your mind — and continue your path to completion</p>
      <div className="flex justify-center bg-primary text-white p-3 mt-3">
      <button className="bg-primarydark border p-2 border-3 border-white rounded-xl"onClick={continueOnboarding}>Finished</button>
      </div>
    <TagSelector />
    </div>
  )
};

export default OnboardingTags