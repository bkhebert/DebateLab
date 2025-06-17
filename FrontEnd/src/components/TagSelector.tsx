import { FaLeaf, FaDharmachakra,  FaTree, FaSpinner, FaHandPeace, FaCrown, FaStarOfDavid, FaStarAndCrescent, FaGavel,  FaDice, FaUserSecret, FaFistRaised, FaArrowAltCircleUp, FaSmileWink, FaShieldAlt, FaBalanceScale, FaHeart, FaSkull, FaSmile, FaBiohazard, FaDove, FaCross, FaFire, FaYinYang, FaQuestion } from "react-icons/fa";
import { tokenManager } from "../utils/tokenManager";
import { GiJesterHat, GiLibertyWing, GiThreeLeaves, GiHammerSickle } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { IoMdChatbubbles } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import Tag from "./Tag";
const icons = {
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
  
"FaSnileWink": <FaSmileWink />, 
   "FaArrowAltCircleUp": <FaArrowAltCircleUp />, 
   "FaShieldAlt": <FaShieldAlt />, 
   "FaCrown": <FaCrown/>,  
   "FaFistRaised": <FaFistRaised />, 
 "FaUserSecret": <FaUserSecret />,  
  "FaSpinner":<FaSpinner/>,
};

export default function TagSelector() {
  const [ tags, setTags] = useState([]);

  useEffect(() => {
    getAllTags();
  }, []);

    const updateView = (chosenTag) => {
      console.log(chosenTag)
    chosenTag.isSelected = !chosenTag.isSelected;
    axios.post(`${baseURL}/api/politicalPhilosophy/UpdateView`, {
      body: {
        views: chosenTag,
        topic: chosenTag.columnName,
      }
    }, {
  headers: {
    'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
    'Content-Type': 'application/json'
  }
})
    .then(() => {
      console.log('post req sent')
      getAllTags();
    })
    .catch((err) => {
      console.error('error submitting new view', err)
    })
  }

  const getAllTags = () => {
    axios.get(`${baseURL}/api/politicalPhilosophy/getTopics`, {
  headers: {
    'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
    'Content-Type': 'application/json'
  }
})
    .then((tagInfo) => {
      console.log('got tags', tagInfo);
      const allTags = [];
      for(const key in tagInfo.data[0]){

        if(tagInfo.data[0][key] && key !== 'createdAt' && key !== 'updatedAt' && key !== 'email' && key !== 'id'  ){



            const parsed = JSON.parse(tagInfo.data[0][key]);
            console.log(parsed.columnName, parsed.color, 'parsed object');
            allTags.push({
              columnName: key,
              label: parsed.label,
              icon: parsed.icon,
              color: parsed.color,
              isSelected: parsed.isSelected,
            });
            
        } 
        setTags(allTags);
      }
    }) .catch((err) => {
        console.error('there is a fuck up w/ topics', err)
      })
  }
  return (
    <div>
          <h1 className="text-center text-primary">selectedTags</h1 >
          <div className="max-h-[20vh] overflow-y-auto rounded-xl bg-gradient-to-b from-zinc-900 to-purple-950 p-4 shadow-xl border border-purple-700">

      <h2 className="text-2xl font-bold text-purple-200 mb-4 text-center">Selected Tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tags.map((tag) => (
          tag.isSelected ? <Tag key={tag.color} tag={tag} updateView={updateView} icon={icons[tag.icon]}/> : <></>
        ))}
      </div>
    </div>
    <div className="max-h-[80vh] overflow-y-auto rounded-xl bg-gradient-to-b from-zinc-900 to-purple-950 p-4 shadow-xl border border-purple-700">

      <h2 className="text-2xl font-bold text-purple-200 mb-4 text-center">Select Your Tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tags.map((tag) => (
          tag.isSelected ? <></> : <Tag key={tag.color} tag={tag} updateView={updateView} icon={icons[tag.icon]}/>
        ))}
      </div>
    </div>
    </div>
  );
}