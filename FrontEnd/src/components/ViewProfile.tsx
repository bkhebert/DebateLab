import React from "react";
import { X } from "lucide-react";

interface Belief {
  category: string;
  subtopic: string;
  description: string;
}

interface UserProfileModalProps {
  onClose: () => void;
  image: string;
  tags: string[];
  beliefs: Belief[];
  username: string;
  school:string;
}


const UserProfileModal: React.FC<UserProfileModalProps> = ({
  onClose,
  image,
  tags,
  beliefs,
  username,
  school,
}) => {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-auto p-6 rounded-2xl shadow-2xl border border-violet-600 bg-gradient-to-br from-[#3b0a56] via-[#4b117a] to-[#250044] text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-violet-300"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="flex-shrink-0">
            <img
              src={image}
              alt="User avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-violet-500 shadow-lg"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-center">{school}</h2>
            <h2 className="text-3xl font-bold mb-2 text-violet-200">{username}</h2>

            <div className="mb-4 flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-violet-700 text-sm rounded-full border border-violet-400 shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6">

              <h3 className="text-xl font-semibold mb-3 border-b border-violet-500 pb-1">
                Beliefs
              </h3>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {beliefs.map((belief, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#4c1c7b] rounded-lg border border-violet-600 shadow-md"
                  >
                    <p className="text-sm text-violet-300 mb-1 uppercase tracking-wide">
                      {belief.category} → {belief.subtopic}
                    </p>
                    <p className="text-sm text-violet-100">
                      {belief.description.length > 0 ? belief.description : "No description provided."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;