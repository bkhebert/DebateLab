import { FaLeaf, FaDharmachakra,  FaTree, FaSpinner, FaHandPeace, FaCrown, FaStarOfDavid, FaStarAndCrescent, FaGavel,  FaDice, FaUserSecret, FaFistRaised, FaArrowAltCircleUp, FaSmileWink, FaShieldAlt, FaBalanceScale, FaHeart, FaSkull, FaSmile, FaBiohazard, FaDove, FaCross, FaFire, FaYinYang, FaQuestion } from "react-icons/fa";

import { GiJesterHat, GiLibertyWing, GiThreeLeaves, GiHammerSickle } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { IoMdChatbubbles } from "react-icons/io";

const tags = [
  { label: "Pro-Life", icon: <FaHeart />, color: "bg-pink-600" },
  { label: "Pro-Choice", icon: <FaBalanceScale />, color: "bg-red-500" },
  { label: "Libertarian", icon: <GiLibertyWing />, color: "bg-yellow-500" },
  { label: "Socialist", icon: <GiHammerSickle />, color: "bg-red-700" },
  { label: "Anarchist", icon: <FaGavel />, color: "bg-black" },
  { label: "Centrist", icon: <FaBalanceScale />, color: "bg-gray-500" },
  { label: "Pacifist", icon: <FaDove />, color: "bg-blue-300" },
  { label: "Feminist", icon: <BsGenderFemale />, color: "bg-pink-400" },
  { label: "Men’s Rights Advocate", icon: <BsGenderMale />, color: "bg-blue-400" },
  { label: "Anti-Capitalist", icon: <GiHammerSickle />, color: "bg-green-900" },
  { label: "Environmentalist", icon: <FaLeaf />, color: "bg-green-600" },
  { label: "Climate Skeptic", icon: <FaQuestion />, color: "bg-yellow-300" },
  { label: "AI Doomer", icon: <FaSkull />, color: "bg-purple-700" },
  { label: "Agnostic", icon: <FaQuestion />, color: "bg-gray-600" },
  { label: "Atheist", icon: <FaBiohazard />, color: "bg-black text-white" },
  { label: "Nihilist", icon: <FaSkull />, color: "bg-zinc-800" },
  { label: "Absurdist", icon: <FaSmile />, color: "bg-lime-600" },
  { label: "Free Speech Advocate", icon: <IoMdChatbubbles />, color: "bg-indigo-600" },
  { label: "Cancel Culture Critic", icon: <MdOutlineCancel />, color: "bg-rose-600" },
  { label: "Traditionalist", icon: <FaFire />, color: "bg-orange-700" },
  { label: "Chaotic Neutral", icon: <FaDice />, color: "bg-indigo-700" },
  { label: "Question Everything", icon: <FaQuestion />, color: "bg-gray-700" },
  { label: "Progressive", icon: <GiThreeLeaves />, color: "bg-emerald-500" },
  { label: "Christian", icon: <FaCross />, color: "bg-purple-900" },
  { label: "Islamic", icon: <FaStarAndCrescent />, color: "bg-green-800" },
  { label: "Hinduism", icon: <FaFire />, color: "bg-orange-600" },
  { label: "Buddhist", icon: <FaYinYang />, color: "bg-yellow-400" },
  { label: "Judaic", icon: <FaStarOfDavid />, color: "bg-blue-800" },
  { label: "Sikhism", icon: <FaDharmachakra />, color: "bg-red-600" },
  { label: "Jainism", icon: <FaHandPeace />, color: "bg-pink-700" },
  { label: "Taoism", icon: <FaYinYang />, color: "bg-teal-500" },
  { label: "Confucianism", icon: <FaYinYang />, color: "bg-yellow-600" },
  { label: "Shinto", icon: <FaTree />, color: "bg-red-400" },
  { label: "Troll", icon: <GiJesterHat />, color: "bg-green-700" },
  { label: "Jester", icon: <GiJesterHat />, color: "bg-purple-600" },
    { label: "Sex-Positive", icon: <FaSmileWink />, color: "bg-fuchsia-600" },
      { label: "Progressive", icon: <FaArrowAltCircleUp />, color: "bg-blue-900" },
        { label: "Conservative", icon: <FaShieldAlt />, color: "bg-red-900" },
          { label: "Rastafarian", icon: <FaCrown/>, color: 'bg-green-950'},
            { label: "Communist", icon: <FaFistRaised />, color: "bg-red-500" },
              { label: "Conspiracy Theorist", icon: <FaUserSecret />, color: "bg-slate-800" },
  { label: "Psychedelics", icon:<FaSpinner/>, color:" bg-gradient-to-br from-red-500 via-yellow-500 via-green-500 to-purple-500"}
];

export default function TagSelector() {
  return (
    <div className="max-h-[80vh] overflow-y-auto rounded-xl bg-gradient-to-b from-zinc-900 to-purple-950 p-4 shadow-xl border border-purple-700">
      <h2 className="text-2xl font-bold text-purple-200 mb-4 text-center">Select Your Tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tags.map((tag) => (
          <div
            key={tag.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-md text-white text-sm font-medium ${tag.color} hover:scale-105 transition-transform`}
          >
            <span className="text-lg">{tag.icon}</span>
            <span>{tag.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}