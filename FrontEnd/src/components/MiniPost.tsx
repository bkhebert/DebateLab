import { Separator } from "./ui/Separator";
import { FaBalanceScaleLeft } from "@react-icons/all-files/fa/FaBalanceScaleLeft";
import { cn } from "../lib/utils";

const MiniPost = ({
  img,
  username,
  date,
  body,
}: {
  img: string | null;
  username: string| null;
  date: string;
  body: string | null;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-fit sm:w-36 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black dark:text-white">
            {username}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{date}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default MiniPost;