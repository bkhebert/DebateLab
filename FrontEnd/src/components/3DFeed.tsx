import { cn } from "../lib/utils";
import { Marquee } from "./ui/Marquee";
import MiniPost from "./MiniPost";
import { useState } from "react";
const reviews = [
  {
    name: "Sophia",
    username: "@sophia",
    body: "True liberty begins where dialogue thrives. Without the freedom to speak, we lose the freedom to think.",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Marcus",
    username: "@marcus",
    body: "Reason is not a weapon, but a light. We wield it not to defeat, but to illuminate.",
    img: "https://avatar.vercel.sh/marcus",
  },
  {
    name: "Hypatia",
    username: "@hypatia",
    body: "Ignorance is not vanquished by silence, but by conversation. Speak, listen, learn — in that order.",
    img: "https://avatar.vercel.sh/hypatia",
  },
  {
    name: "Alain",
    username: "@alain",
    body: "Censorship creates an illusion of certainty. But only in freedom does the mind truly sharpen.",
    img: "https://avatar.vercel.sh/alain",
  },
  {
    name: "Zeno",
    username: "@zeno",
    body: "Debate is not division — it is the highest form of respect for another mind’s existence.",
    img: "https://avatar.vercel.sh/zeno",
  },
  {
    name: "Simone",
    username: "@simone",
    body: "To understand is to listen. To grow is to question. To be free is to do both relentlessly.",
    img: "https://avatar.vercel.sh/simone",
  },
  {
    name: "Galileo",
    username: "@galileo",
    body: "They silenced the stars once. Let us not repeat that mistake with each other.",
    img: "https://avatar.vercel.sh/galileo",
  }
]
 
const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);
const thirdRow = reviews.slice(0, reviews.length / 2);
const fourthRow = reviews.slice(reviews.length / 2);
 
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
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
            {name}
          </figcaption>
          <p className="text-xs font-medium text-black dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-black dark:text-white">{body}</blockquote>
    </figure>
  );
};
 
export function Marquee3D() {
    const [miniPostNumber, setMiniPostNumber] = useState([
      'tag1', 'awef', 'fdsaf', 'gfsd', 'trew', 'uytr', 'opoiu'])
  return (
    <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        <Marquee pauseOnHover vertical className="[--duration:20s]">
                  { miniPostNumber.map((userInfo) => (
            <MiniPost username={userInfo} img="/anonprofile.png" date="Date" body="I argue about something here asdfadsfadfsadsf"/>
           ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
          {thirdRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee pauseOnHover className="[--duration:20s]" vertical>
          {fourthRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>
 
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}