import { useAllPosts } from "../hooks/useAllPosts";
import Post from "../components/Post";
import { Loader } from "lucide-react"; // Optional

const TheGreatConversation = () => {
  const { posts, loading, error } = useAllPosts(); // Destructure the hook's return value
  
  if (loading) return <Loader />; // Or <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="">
      {posts.slice(0, 10).map((postInfo) => ( // Only show 10 most recent
        <div key={postInfo.id} className="flex justify-center">
          <Post postInfo={postInfo} />
        </div>
      ))}
    </div>
  );
};

export default TheGreatConversation;