import { tagIcons } from "../../utils/tagIcons";

interface TagIconProps {
  tag: {
    label: string;
    color: string;
    icon?: string;
  };
}

// Compact, icon-only badge shown next to a post/comment author's name.
// Several tags share the same icon (e.g. "Agnostic" and "Question Everything"
// both use a question mark), so the full name is only disambiguated via the
// hover tooltip rather than shown inline.
export default function TagIcon({ tag }: TagIconProps) {
  if (typeof tag.color !== "string") return null;

  return (
    <span
      title={tag.label}
      aria-label={tag.label}
      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-xs shadow-sm ${tag.color}`}
    >
      {tagIcons[tag.icon ?? ""] ?? null}
    </span>
  );
}
