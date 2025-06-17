import { useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import useAuth from "../contexts/useAuth";

interface ReplyFormProps {
  messageId: number;
  onReplyPosted: () => void;
}

const ReplyForm = ({ messageId, onReplyPosted }: ReplyFormProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        `${baseURL}/api/message/reply`,
        { 
          reply: { 
            content, 
            messageId 
          } 
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
        }
      );
      setContent("");
      onReplyPosted();
    } catch (error) {
      console.error("Failed to post reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          className="flex-1 p-2 border rounded-l text-sm"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-r text-sm"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;