import { Separator } from "./ui/Separator";
import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft";
import { useEffect, useState } from "react";
import UserProfileModal from "./ViewProfile";
import { formatDistanceToNow } from 'date-fns';
const infoNeeded = {
  img: '/anonprofile.png',
  tags: ['pro-life', 'environmentalist'],
  beliefs: [{
    category: 'Philosophy',
    subCategory: 'Ontology',
    description: 'there is no god',
  }],

}
const Post = ({postInfo}) => {
  
  const [showProfileView, setShowProfileView] = useState(false);
  const[tags, setTags] = useState([]);
 useEffect(() => {
  console.log('hello')
    if (!postInfo.author?.PoliticalView) return;

    const selectedTags = Object.values(postInfo.author.PoliticalView)
      .reduce<{label: string, color: string}[]>((acc, viewString) => {
        console.log(acc)
        try {
          const view = JSON.parse(viewString as string);
          return view.isSelected 
            ? [...acc, { label: view.label, color: view.color }] 
            : acc;
        } catch {
          return acc;
        }
      }, []);

    setTags(selectedTags);
  }, []);

  const handleClick = () => {
    setShowProfileView(!showProfileView);
  }
  const timeAgo = (isoString: string) => {
      return formatDistanceToNow(new Date(isoString), { addSuffix: true })
  }
  return (
        <div className="mx-3 p-2 mb-2 rounded-md border border-black p-3 md:w-full lg:w-3/4">
  {   !showProfileView &&  ( <div className="">
          <div className="grid grid-cols-8 grid-rows-2 bg-cstmwhite">
            <div className="col-span-1 row-span-2 flex justify-center">
            <img
    src="/public/anonprofile.png"
    alt="Profile"
    className="w-10 h-10 rounded-full object-cover mx-auto"
    onClick={handleClick}
  /></div>
  <div className="col-span-7 font-bold ml-2">
    <div>{postInfo.author?.username || "anon"}</div>
  </div>
  <div className="col-span-7 italic ml-2 text-sm">{timeAgo(postInfo.createdAt)}</div>
  
  <div className="col-span-8 text-xs grid grid-cols-4">
    {tags.map((tag, index) => (
          <span 
            key={index}
            className={`px-2 py-0.5 mx-0.5 rounded-md text-center truncate ${tag.color} text-white`}
            title={tag.label}
          >
            {tag.label}
          </span>
        ))}
    </div>
  </div>
        <Separator className="bg-black/50  mt-1"/>
        <div className="grid grid-cols-4 auto-rows-auto text-xs mt-2">
        <div className="col-span-1 flex py-auto">
          <div className="my-auto">Fallacies: {postInfo.content.fallacies.length}</div>
        <FaBalanceScaleLeft className="mx-auto ml-1 my-auto"/>
        </div>
        {postInfo.content.fallacies.map((fallacy) => (
          <div className="my-auto mx-auto bg-red-600 text-black rounded text-centerfont-light">{fallacy}</div>
        ))}
        
        </div>
        <Separator className="bg-black/50  mt-1"/>
        <div className="mx-3 text-center max-w-2xl">
          {postInfo.content.argument}</div>
        </div>)}
        {showProfileView && (
          <UserProfileModal username={postInfo.author.username} image={infoNeeded.img} tags={tags.map((tag) => tag.label)} school={postInfo.author.school} beliefs={postInfo.author.philosophies} onClose={handleClick}/>
        )}
        <Separator className="bg-black/50 mt-1"/>
        <div className="flex justify-center pt-2">
          <button className="p-2 py-1 bg-primarylight/80 text-black">DEBATE</button>
        </div>
        </div>
  )
}
export default Post;