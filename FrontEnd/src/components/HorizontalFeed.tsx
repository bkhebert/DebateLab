import { Marquee } from "./ui/Marquee";
import Post from "./Post";
import { useAllPosts } from "../hooks/useAllPosts";
import { Loader } from "lucide-react";

export function HorizontalFeed() {

  const { posts, loading, error } = useAllPosts(); // Destructure the hook's return value

  if (loading) return <Loader />; // Or <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
         { posts.map((postInfo) => (
          <div key={postInfo.id} className="flex justify-center">
<Post postInfo={postInfo}/></div>
    ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
           { posts.map((postInfo) => (
             <div key={postInfo.id} className="flex justify-center">
<Post postInfo={postInfo}/></div>
    ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
