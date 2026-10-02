import MobileLayout from "../components/MobileLayout";
import DesktopLayout from "./DesktopLayout";
import useAuth from "../contexts/useAuth";
import useTopicFilter from "../contexts/useTopicFilter";
import { debateTopics } from "../constants/debateTopics";
function Home() {

  const {user} = useAuth();
  const { selectedSubject, selectedSubTopic } = useTopicFilter();

  // A sub-topic picked in RightSideBar is a single real topic. A subject
  // picked with no sub-topic yet means "show everything under this
  // subject", so the feed queries all of its sub-topics joined together
  // (see usePosts.ts / BackEnd messageRouter.ts's "|"-delimited topic list).
  const subjectSubs = selectedSubject
    ? debateTopics.find((subject) => subject.title === selectedSubject)?.subs.map((s) => s.sub)
    : undefined;
  const feedTopic = selectedSubTopic || subjectSubs?.join('|') || null;
  const displayTopic = selectedSubTopic || selectedSubject || null;

return (
    <div>
      {/* Left Sidebar */}


  { !user && <div className="hidden lg:block">
  <DesktopLayout />
  </div>
  }
   <div className={`${user ? "" : "lg:hidden" }`}>
    <MobileLayout feedTopic={feedTopic} displayTopic={displayTopic} postTopic={selectedSubTopic || null}/>
    </div>
      {/* Right Sidebar */}

    </div>
  );
}


export default Home;