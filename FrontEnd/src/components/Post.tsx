/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from "./ui/Separator";
import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft";
import { useEffect, useState } from "react";
import UserProfileModal from "./ViewProfile";
import { formatDistanceToNow } from 'date-fns';
import useAuth from "../contexts/useAuth";
import baseURL from "../constants/constant";
const infoNeeded = {
  img: '/anonprofile.png',
  tags: ['pro-life', 'environmentalist'],
  beliefs: [{
    category: 'Philosophy',
    subCategory: 'Ontology',
    description: 'there is no god',
  }],

}
const Post = ({ postInfo }: { postInfo: any }) => {
  const { user } = useAuth();
  const [showProfileView, setShowProfileView] = useState(false);
  const[tags, setTags] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
const [replyText, setReplyText] = useState("");
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
const submitReply = async (parentReplyId = null) => {
  try {
    await fetch(`${baseURL}/api/message/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: replyText,
        messageId: postInfo.id,
        userId: user.id, // get from context/auth
        parentReplyId: parentReplyId,
      }),
    });
    setReplyText('');
    setShowReplyForm(false);
    // optionally: refresh post or replies
  } catch (err) {
    console.error(err);
  }
};
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
        <button
  className="p-2 py-1 bg-primarylight/80 text-black"
  onClick={() => setShowReplyForm(!showReplyForm)}
>
  DEBATE
</button>
 {postInfo.Replies && postInfo.Replies.length > 0 && (
  <div className="mt-4 pl-4 border-l-2 border-gray-300">
    {postInfo.Replies.slice().reverse().map((reply) => (
      <div key={reply.id} className="mb-2">
        <div className="text-sm font-semibold">{reply.author?.username || 'anon'}:</div>
        <div className="text-sm mb-1">{reply.content}</div>

        {reply.children?.length > 0 && (
          <div className="ml-4 border-l pl-2">
            {reply.children.slice().reverse().map((child) => (
              <div key={child.id}>
                <div className="text-sm font-semibold">{child.author?.username || 'anon'}:</div>
                <div className="text-sm mb-1">{child.content}</div>
              </div>
            ))}
          </div>
        )}

        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => {
            setShowReplyForm(true);
          }}
        >
          Reply
        </button>
      </div>
    ))}
  </div>
)}
        {showReplyForm && (
  <div className="flex flex-col items-center mt-2">
    <textarea
      className="w-full p-1 border rounded"
      value={replyText}
      onChange={(e) => setReplyText(e.target.value)}
      placeholder="Write your reply..."
    />
    <button
      className="mt-1 bg-green-500 text-white px-2 py-1 rounded"
      onClick={() => submitReply()}
    >
      Submit Reply
    </button>
  </div>
)}
        </div>
  )
}
export default Post;