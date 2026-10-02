import { useContext } from "react";
import { TopicFilterContext } from "./TopicFilterContext";

export function useTopicFilter() {
  const context = useContext(TopicFilterContext);
  if (!context) {
    throw new Error("useTopicFilter must be used within a TopicFilterProvider");
  }
  return context;
}

export default useTopicFilter;
