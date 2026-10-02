import AnalyzerCard from "./AnalyzerCard"
import Feed from "./Feed"
import { Separator } from "@radix-ui/react-separator"
import { Button } from "./ui/Button"
import { Swords } from "lucide-react"
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface MobileLayoutProps {
  // What the feed queries by - may be several sub-topics joined with "|"
  // when a whole subject (not a specific sub-topic) is selected.
  feedTopic?: string | null;
  // Human-readable label shown in the UI prompts. Falls back to feedTopic
  // when not given, since most callers only ever deal with one real topic.
  displayTopic?: string | null;
  // What a newly-submitted post gets tagged with. Kept separate from
  // feedTopic because the joined "A|B|C" aggregate used to fetch a whole
  // subject's posts is not a valid topic to post a new message under.
  postTopic?: string | null;
}

const MobileLayout = ({ feedTopic, displayTopic, postTopic }: MobileLayoutProps) => {
  const topic = displayTopic !== undefined ? displayTopic : feedTopic;
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const toggleAnalyzer = () => setShowAnalyzer(!showAnalyzer);
  const navigate = useNavigate();
  const toTopics = () => {

    navigate('/debates')
  }

  return (

      <main className="col-span-1 lg:col-span-8 lg:px-4 h-screen overflow-y-auto pb-16">
        {/* Argument Input */}
        <div className="mt-1 mx-2 flex items-center gap-2 px-4 py-3 bg-card rounded-xl shadow-card border border-border cursor-pointer hover:bg-accent transition"
          onClick={toggleAnalyzer}>
          <img
            src="/anonprofile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          { !topic && <span className="text-muted-foreground text-sm">Enter an argument for analysis here...</span>}
           { topic && <span className="text-muted-foreground text-sm">Submit a post for debate in {topic}?</span>}
        </div>

        {showAnalyzer && (
          <div className='absolute top-0 right-0 left-0 bg-cstmblack/50 h-full z-50'>
            <div className="lg:top-4">
            <AnalyzerCard closeModal={() => setShowAnalyzer(false)} topic={postTopic !== undefined ? postTopic : topic} showLogo={true} showExit={true} isDemo={false}/>
            </div>
          </div>
        )}

        {/* Donation */}
        <div className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">
          Debate App Powered By A.I.
        </div>

        <Separator className="mt-2 mb-2 bg-cstmblack" />
          { !topic && <div className="flex justify-center gap-2 mt-3">
          <Button
          onClick={toTopics}
          className="bg-card hover:bg-accent text-primary border-solid border-2 border-primary/70 p-2 rounded-full">Choose A Debate Topic</Button>
          <Link to="/training">
            <Button className="gap-1.5 rounded-full">
              <Swords size={16} /> Train vs. AI
            </Button>
          </Link>
        </div>}
        <h6 className="flex justify-center mt-4 md:mt-12 font-mono italic font-bold">Recent debates{topic? ` on ${topic}`: ""}</h6>

        {/* Feed (scrollable) */}
        <Feed topic={feedTopic} />
      </main>
  )
}

export default MobileLayout