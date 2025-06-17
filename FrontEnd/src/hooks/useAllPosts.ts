// hooks/useAllPosts.ts
import { useState, useEffect } from "react";
import axios from "axios";
import { type MessageWithReplies } from "../types/MessageWithReplies";
import baseURL from "../constants/constant";
export const useAllPosts = () => {
  const [posts, setPosts] = useState<MessageWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<MessageWithReplies[]>(`${baseURL}/api/message/all/recent`);
        
        // Axios stores data in response.data (not response.json())
        setPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};


