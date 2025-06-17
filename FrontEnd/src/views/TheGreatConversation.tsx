import { useAllPosts } from "../hooks/useAllPosts";
import Post from "../components/Post";
import { Loader } from "lucide-react"; // Optional
import { Link } from "react-router-dom";
const TheGreatConversation = () => {
  const { posts, loading, error } = useAllPosts(); // Destructure the hook's return value
  
  if (loading) return <Loader />; // Or <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="">
      <div className="grid grid-cols-2">
        <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-gray-900 text-white rounded-2xl p-6 shadow-xl border border-purple-500/30 max-w-md mx-auto my-4 animate-fade-in">
  <h2 className="text-2xl font-extrabold mb-2 tracking-tight">
    ⚔️ The Arena Awaits
  </h2>
  <p className="text-sm text-indigo-200 mb-4">
    Step into live 1v1 and 1vAny debates. Test your logic, challenge ideas, and refine your beliefs in real time.
  </p>
  <ul className="list-disc list-inside text-purple-200 text-sm mb-4">
    <li>Earn respect through reasoning</li>
    <li>Debate anonymously or as yourself</li>
    <li>Real-time audience votes coming soon</li>
  </ul>
  <Link to={"/signUp"}><button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition">
    Sign Up & Join The Debate
  </button></Link>
</div>
<div className="bg-gradient-to-br from-fuchsia-900 via-purple-800 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-fuchsia-500/30 max-w-md mx-auto my-4 animate-fade-in">
  <h2 className="text-2xl font-extrabold mb-2 tracking-tight">
    🎭 Jubilee-Style Games Are Coming 
  </h2>
  <p className="text-sm text-fuchsia-200 mb-4">
    Thought-provoking social experiments, anonymous truths, and group discussion games designed to spark deep thought.
  </p>
  <ul className="list-disc list-inside text-pink-200 text-sm mb-4">
    <li>Walk in another's shoes</li>
    <li>Speak honestly without judgment</li>
    <li>Help bridge philosophical divides</li>
  </ul>
  <div className="space-y-2">
    <button className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold py-2 px-4 rounded-md transition">
      Games & Events Coming Soon!
    </button>
   <a
        href="https://www.paypal.com/donate/?business=BCJFZUCNXZ7L4&no_recurring=0&item_name=Hi%21+I+am+the+guy+who+made+DebateLab%21+This+project+is+kept+alive+by+donations+until+we+receive+funding.+Anything+helps.+%0A-Cheers&currency_code=USD"
        target="_blank"
        rel="noopener noreferrer" className="mt-3"> <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition">
      Donate to Support the Mission 🕊️
    </button></a> 
  </div>
</div>

      </div>
      {posts.slice(0, 10).map((postInfo) => ( // Only show 10 most recent
        <div key={postInfo.id} className="flex justify-center">
          <Post postInfo={postInfo} />
        </div>
      ))}
    </div>
  );
};

export default TheGreatConversation;