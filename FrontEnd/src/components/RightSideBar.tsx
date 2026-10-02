import { Link } from "react-router-dom";
import { Eye, Tag, Brain, IdCard, Swords } from "lucide-react";
import useAuth from "../contexts/useAuth";
import useTopicFilter from "../contexts/useTopicFilter";
import { debateTopics } from "../constants/debateTopics";

const RightSideBar = () => {
  const { user } = useAuth();
  const { selectedSubject, selectedSubTopic, selectSubject, selectSubTopic } = useTopicFilter();

  if (!user) {
    return (
      <aside className="hidden lg:block lg:col-span-2 border-l border-border p-4 bg-background h-screen overflow-y-auto text-foreground">
        <h2 className="text-sm font-semibold text-foreground mb-2">Upcoming Features</h2>
        <ul className="text-xs space-y-2 text-muted-foreground">
          <li className="hover:text-primary transition-colors">Unlimited Analysis</li>
          <li className="hover:text-primary transition-colors">Educational Tools</li>
          <li className="hover:text-primary transition-colors">Speech Recognition: </li>
          <li className="hover:text-primary transition-colors italic">*Real-Time Debate Analysis for Speech</li>
          <li className="hover:text-primary transition-colors ">Debate Games</li>
          <li className="hover:text-primary transition-colors">1 v 25 debates</li>
          <li className="hover:text-primary transition-colors">Notifications System</li>
          <li className="hover:text-primary transition-colors">Team Debates</li>
          <li className="hover:text-primary transition-colors">Chrome Extension</li>
          <li className="hover:text-primary transition-colors">Mobile App</li>
          <li className="hover:text-primary transition-colors italic">* 5 Checks per 24 hours</li>
        </ul>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:block lg:col-span-2 border-l border-border p-4 bg-background h-screen overflow-y-auto text-foreground">
      <Link
        to="/training"
        className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        <Swords size={16} /> Train vs. AI
      </Link>

      <nav className="space-y-2 text-sm mb-4">
        <Link to="/profile?view=beliefs" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Eye size={16} /> My Beliefs
        </Link>
        <Link to="/profile?view=tags" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Tag size={16} /> Tags
        </Link>
        <Link to="/profile?view=school" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Brain size={16} /> School Of Thought
        </Link>
        <Link to="/profile?view=card" className="flex items-center gap-2 hover:text-primary transition-colors">
          <IdCard size={16} /> My Profile Card
        </Link>
      </nav>

      <hr className="border-border mb-4" />

      <nav className="space-y-1 text-sm">
        {debateTopics.map((subject) => {
          const isActiveSubject = selectedSubject === subject.title;
          return (
            <div key={subject.title}>
              <button
                onClick={() => selectSubject(subject.title)}
                className={`w-full flex items-center gap-2 text-left px-2 py-1.5 rounded transition-colors ${
                  isActiveSubject
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "hover:bg-accent hover:text-primary"
                }`}
              >
                <span className="text-base">{subject.icon}</span>
                {subject.title}
              </button>
              {isActiveSubject && (
                <div className="ml-6 mt-1 mb-2 space-y-1">
                  {subject.subs.map((sub) => {
                    const isActiveSubTopic = selectedSubTopic === sub.sub;
                    return (
                      <button
                        key={sub.sub}
                        onClick={() => selectSubTopic(sub.sub)}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                          isActiveSubTopic
                            ? "bg-primary/80 text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-primary"
                        }`}
                      >
                        {sub.sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default RightSideBar;
