import axios from "axios";
import { useEffect, useState } from "react";
import baseURL from "../constants/constant";

export function usePosts(topic?: string) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const resolvedTopic = topic?.trim() ? topic : "The Great Conversation";

    axios.get(`${baseURL}/api/message/${resolvedTopic}`)
      .then((res) =>{ 
        setPosts(res.data)  
   
       })
      .catch((err) => console.error("Failed to fetch posts:", err));
  }, [topic]);

  return posts;
}
