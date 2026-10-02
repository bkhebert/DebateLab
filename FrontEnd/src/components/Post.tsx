/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "./ui/Button";
import { MessageCircle, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import UserProfileModal from "./ViewProfile";
import { formatDistanceToNow } from 'date-fns';
import useAuth from "../contexts/useAuth";
import baseURL from "../constants/constant";
import TagIcon from "./ui/TagIcon";
import { cn } from "../lib/utils";

const infoNeeded = {
  img: '/anonprofile.png',
  tags: ['pro-life', 'environmentalist'],
  beliefs: [{
    category: 'Philosophy',
    subCategory: 'Ontology',
    description: 'there is no god',
  }],

}

const timeAgo = (isoString: string) => formatDistanceToNow(new Date(isoString), { addSuffix: true });

const getAuthorTags = (author: any) => {
  if (!author?.PoliticalView) return [];
  return Object.values(author.PoliticalView).reduce<{ label: string, color: string, icon: string }[]>((acc, viewString) => {
    try {
      const view = JSON.parse(viewString as string);
      return view.isSelected
        ? [...acc, { label: view.label, color: view.color, icon: view.icon }]
        : acc;
    } catch {
      return acc;
    }
  }, []);
};

// Indentation grows per depth but is capped so a long thread doesn't
// collapse into an unreadable staircase, especially on mobile.
const MAX_INDENT_DEPTH = 4;
const INDENT_PX_PER_DEPTH = 20;

// Recursive: a reply can itself have replies at any depth, each with its
// own "Reply" trigger - this is what actually enables replying to a reply
// rather than only ever being able to respond to the top-level post.
const ReplyRow = ({
  reply,
  depth,
  replyTarget,
  onToggleReply,
  replyText,
  setReplyText,
  onSubmit,
}: {
  reply: any;
  depth: number;
  replyTarget: number | null;
  onToggleReply: (id: number) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onSubmit: (parentReplyId: number) => void;
}) => {
  const tags = getAuthorTags(reply.author);
  const isActive = replyTarget === reply.id;

  // marginLeft nests through real DOM recursion, so each level's margin
  // compounds with its ancestors' - cap it to 0 past MAX_INDENT_DEPTH
  // (rather than capping the per-level value) so deep threads stop
  // indenting further instead of still growing by a smaller amount each time.
  const indent = depth > 0 && depth <= MAX_INDENT_DEPTH ? INDENT_PX_PER_DEPTH : 0;

  return (
    <div
      style={{ marginLeft: indent }}
      className={cn("py-2.5", depth > 0 ? "pl-3 border-l-2 border-border" : "px-3 sm:px-4")}
    >
      <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
        <span className="font-semibold text-sm text-foreground">{reply.author?.username || "anon"}</span>
        {tags.length > 0 && (
          <div className="flex gap-1">
            {tags.map((tag, index) => <TagIcon key={index} tag={tag} />)}
          </div>
        )}
      </div>
      <p className="mt-0.5 text-sm text-foreground whitespace-pre-wrap break-words">{reply.content}</p>
      <button
        onClick={() => onToggleReply(reply.id)}
        className="mt-1 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        Reply
      </button>

      {isActive && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 text-sm border border-border rounded-lg bg-background text-foreground"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
          />
          <div className="flex justify-end mt-1.5">
            <Button size="sm" onClick={() => onSubmit(reply.id)}>
              Reply
            </Button>
          </div>
        </div>
      )}

      {reply.children?.length > 0 && reply.children.slice().reverse().map((child) => (
        <ReplyRow
          key={child.id}
          reply={child}
          depth={depth + 1}
          replyTarget={replyTarget}
          onToggleReply={onToggleReply}
          replyText={replyText}
          setReplyText={setReplyText}
          onSubmit={onSubmit}
        />
      ))}
    </div>
  );
};

const Post = ({ postInfo }: { postInfo: any }) => {

  const { user } = useAuth();
  const [showProfileView, setShowProfileView] = useState(false);
  const [tags, setTags] = useState<{label: string, color: string, icon: string}[]>([]);
  // null = no reply box open anywhere in this post. 'post' = replying to the
  // top-level message. A number = replying to that specific reply's id -
  // this is what lets every reply in the thread get its own reply box,
  // instead of a single shared one that always posted as a top-level reply.
  const [replyTarget, setReplyTarget] = useState<'post' | number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isHomePage, setIsHomePage] = useState(true);
  const [replies, setReplies] = useState<any[]>(postInfo.Replies || []);

  useEffect(() => {
    setReplies(postInfo.Replies || []);
  }, [postInfo.id, postInfo.Replies]);

  useEffect(() => {
    if(window.location.pathname === "/")
      setIsHomePage(true);
    else
      setIsHomePage(false);
  }, []);

  useEffect(() => {
    setTags(getAuthorTags(postInfo.author));
  }, [postInfo.author]);

  // Replying (at any depth) changes the thread, so re-fetch this one
  // message's full reply tree rather than the whole feed - this is also
  // what makes a newly-posted reply actually show up without a page reload.
  const refetchReplies = async () => {
    try {
      const res = await fetch(`${baseURL}/api/message/single/${postInfo.id}`);
      const data = await res.json();
      setReplies(data.Replies || []);
    } catch (err) {
      console.error('Failed to refresh replies:', err);
    }
  };

  const submitReply = async (parentReplyId: number | null = null) => {
    if (!replyText.trim()) return;
    try {
      await fetch(`${baseURL}/api/message/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyText,
          messageId: postInfo.id,
          userId: user?.id ? user.id : null, // get from context/auth
          parentReplyId: parentReplyId,
        }),
      });
      setReplyText('');
      setReplyTarget(null);
      await refetchReplies();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplyTarget = (target: 'post' | number) => {
    setReplyTarget((current) => (current === target ? null : target));
    setReplyText('');
  };

  const handleClick = () => {
    setShowProfileView(!showProfileView);
  }

  const fallacyCount = postInfo.content.fallacies?.length ?? 0;
  const replyCount = replies.length;

  return (
        <div className={cn(
          "w-full mx-3 mb-3 md:w-full lg:w-3/4 rounded-xl border border-border bg-card text-card-foreground shadow-sm",
          isHomePage && "max-h-[500px] overflow-hidden"
        )}>
  {   !showProfileView &&  (
        <div className="p-3 sm:p-4">
          <div className="flex gap-3">
            <img
              src="/anonprofile.png"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover shrink-0 cursor-pointer"
              onClick={handleClick}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                <span className="font-semibold text-sm text-foreground truncate">{postInfo.author?.username || "anon"}</span>
                <span className="text-xs text-muted-foreground">· {timeAgo(postInfo.createdAt)}</span>
                {tags.length > 0 && (
                  <div className="flex gap-1">
                    {tags.map((tag, index) => <TagIcon key={index} tag={tag} />)}
                  </div>
                )}
              </div>

              <p className={cn(
                "mt-1 text-foreground whitespace-pre-wrap break-words",
                (postInfo.content.argument?.length ?? 0) < 150 ? "text-base sm:text-lg" : "text-sm"
              )}>
                {postInfo.content?.argument}
              </p>

              {fallacyCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {postInfo.content.fallacies.map((fallacy, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20"
                    >
                      {fallacy}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 mt-2.5 -ml-2">
                <button
                  onClick={() => toggleReplyTarget('post')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-full text-muted-foreground text-xs hover:text-primary hover:bg-accent transition-colors"
                >
                  <MessageCircle size={15} />
                  {replyCount > 0 && <span>{replyCount}</span>}
                </button>
                <span className={cn(
                  "flex items-center gap-1.5 px-2 py-1 text-xs",
                  fallacyCount > 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  <Scale size={15} />
                  {fallacyCount} {fallacyCount === 1 ? "fallacy" : "fallacies"}
                </span>
              </div>

              {replyTarget === 'post' && (
                <div className="mt-2">
                  <textarea
                    className="w-full p-2 text-sm border border-border rounded-lg bg-background text-foreground"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                  />
                  <div className="flex justify-end mt-1.5">
                    <Button size="sm" onClick={() => submitReply(null)}>
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
        {showProfileView && (
          <UserProfileModal username={postInfo.author ? postInfo.author.username : "anon"} image={infoNeeded.img} tags={tags.map((tag) => tag.label)} school={postInfo.author ? postInfo.author.school : "This user is anonymous"} beliefs={postInfo.author ? postInfo.author.philosophies : [{category: "anon", subtopic: 'anon', description: 'anon'}]} onClose={handleClick}/>
        )}
 {replies.length > 0 && (
  <div className="border-t border-border">
    {replies.slice().reverse().map((reply) => (
      <ReplyRow
        key={reply.id}
        reply={reply}
        depth={0}
        replyTarget={typeof replyTarget === 'number' ? replyTarget : null}
        onToggleReply={toggleReplyTarget}
        replyText={replyText}
        setReplyText={setReplyText}
        onSubmit={submitReply}
      />
    ))}
  </div>
)}
        </div>
  )
}
export default Post;
