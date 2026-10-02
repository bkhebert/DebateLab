// Longer labels ("Men's Rights Advocate") get a smaller font than short ones
// ("AI Doomer") so every chip stays the same fixed size instead of growing
// or wrapping to a second line.
const labelFontSize = (label: string) => {
  if (label.length <= 10) return "text-sm";
  if (label.length <= 16) return "text-xs";
  return "text-[10px]";
};

const Tag = ({tag, updateView, icon}) => {
  return (
    <div>

    { typeof tag.color === "string" && <div
            key={tag.label}
            className={`flex items-center justify-center gap-2 h-11 px-3 rounded-lg shadow-md text-white font-medium cursor-pointer ${labelFontSize(tag.label)} ${tag.color} hover:scale-105 transition-transform`}
            onClick={() => { updateView(tag)}}
            title={tag.label}
          >
            <span className="text-lg shrink-0">{icon}</span>
            <span className="truncate min-w-0">{tag.label}</span>
   </div>}
   </div>
  )
}

export default Tag;