import { useState } from "react"
import Post from "./Post"
const Feed = ({topic}) => {
  const [postNumber, setPostNumber] = useState([
    'tag1', 'awef', 'fdsaf', 'gfsd', 'trew', 'uytr', 'opoiu'])
  
  return(<div className="">
    { postNumber.map((userInfo) => (
      <div className="flex justify-center"><Post userName={topic}/></div>
    ))}
  </div>)
}
export default Feed;