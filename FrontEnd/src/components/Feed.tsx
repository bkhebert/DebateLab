import { useState } from "react"
import Post from "./Post"
const Feed = () => {
  const [postNumber, setPostNumber] = useState([
    'tag1', 'awef', 'fdsaf', 'gfsd', 'trew', 'uytr', 'opoiu'])
  
  return(<div>
    { postNumber.map((userInfo) => (
      <Post userName={userInfo}/>
    ))}
  </div>)
}
export default Feed;