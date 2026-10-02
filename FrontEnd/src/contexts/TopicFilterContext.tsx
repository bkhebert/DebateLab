import { createContext, useState, type ReactNode } from "react";

interface TopicFilterContextType {
  selectedSubject: string | null;
  selectedSubTopic: string | null;
  selectSubject: (subject: string) => void;
  selectSubTopic: (subTopic: string) => void;
}

export const TopicFilterContext = createContext<TopicFilterContextType | undefined>(undefined);

// Shared between RightSideBar (sets the selection) and Home's feed (reads
// it) - they're layout siblings in App.tsx, not parent/child, so plain
// prop-drilling doesn't reach, same reasoning as AuthContext/DarkModeContext.
export function TopicFilterProvider({ children }: { children: ReactNode }) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);

  const selectSubject = (subject: string) => {
    setSelectedSubject((prev) => (prev === subject ? null : subject));
    setSelectedSubTopic(null);
  };

  const selectSubTopic = (subTopic: string) => {
    setSelectedSubTopic((prev) => (prev === subTopic ? null : subTopic));
  };

  return (
    <TopicFilterContext.Provider value={{ selectedSubject, selectedSubTopic, selectSubject, selectSubTopic }}>
      {children}
    </TopicFilterContext.Provider>
  );
}
