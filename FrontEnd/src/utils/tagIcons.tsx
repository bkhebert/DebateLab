// Shared icon lookup for political-view tags, keyed by the `icon` string
// each PoliticalView column stores (see BackEnd/src/database/models/PoliticalView.ts).
// Single source of truth so TagSelector.tsx (tag picker) and TagIcon.tsx
// (compact badge shown next to posts/comments) never drift out of sync.
import { FaLeaf, FaDharmachakra, FaTree, FaSpinner, FaHandPeace, FaCrown, FaStarOfDavid, FaStarAndCrescent, FaGavel, FaDice, FaUserSecret, FaFistRaised, FaArrowAltCircleUp, FaSmileWink, FaShieldAlt, FaBalanceScale, FaHeart, FaSkull, FaSmile, FaBiohazard, FaDove, FaCross, FaFire, FaYinYang, FaQuestion } from "react-icons/fa";
import { GiJesterHat, GiLibertyWing, GiThreeLeaves, GiHammerSickle } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { IoMdChatbubbles } from "react-icons/io";

export const tagIcons: Record<string, React.ReactNode> = {
  "FaHeart": <FaHeart />,
  "FaBalanceScale": <FaBalanceScale />,
  "GiLibertyWing": <GiLibertyWing />,
  "GiHammerSickle": <GiHammerSickle />,
  "FaGavel": <FaGavel />,
  "FaDove": <FaDove />,
  "BsGenderFemale": <BsGenderFemale />,
  "BsGenderMale": <BsGenderMale />,
  "FaLeaf": <FaLeaf />,
  "FaQuestion": <FaQuestion />,
  "FaSkull": <FaSkull />,
  "FaBiohazard": <FaBiohazard />,
  "FaSmile": <FaSmile />,
  "IoMdChatbubbles": <IoMdChatbubbles />,
  "MdOutlineCancel": <MdOutlineCancel />,
  "FaFire": <FaFire />,
  "FaDice": <FaDice />,
  "GiThreeLeaves": <GiThreeLeaves />,
  "FaCross": <FaCross />,
  "FaStarAndCrescent": <FaStarAndCrescent />,
  "FaYinYang": <FaYinYang />,
  "FaStarOfDavid": <FaStarOfDavid />,
  "FaDharmachakra": <FaDharmachakra />,
  "FaHandPeace": <FaHandPeace />,
  "FaTree": <FaTree />,
  "GiJesterHat": <GiJesterHat />,
  // Was "FaSnileWink" - a typo that meant tag.icon === "FaSmileWink" (the
  // value PoliticalView.ts actually stores for sex_positive) never matched
  // anything, so that tag silently rendered with no icon at all.
  "FaSmileWink": <FaSmileWink />,
  "FaArrowAltCircleUp": <FaArrowAltCircleUp />,
  "FaShieldAlt": <FaShieldAlt />,
  "FaCrown": <FaCrown />,
  "FaFistRaised": <FaFistRaised />,
  "FaUserSecret": <FaUserSecret />,
  "FaSpinner": <FaSpinner />,
};
