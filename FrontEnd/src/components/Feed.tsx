import { useState } from "react"
import { usePosts } from "../hooks/usePosts"
import Post from "./Post"
const Feed = ({topic}: {topic: string}) => {
  const posts = usePosts(topic)
  
  return(<div className="">
    { posts.map((postInfo) => (
      <div key={postInfo.id}className="flex justify-center"><Post postInfo={postInfo}/></div>
    ))}
  </div>)
}
export default Feed;