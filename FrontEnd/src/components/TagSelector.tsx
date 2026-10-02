import { tokenManager } from "../utils/tokenManager";
import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
import Tag from "./Tag";
import { tagIcons as icons } from "../utils/tagIcons";

export default function TagSelector() {
  const [ tags, setTags] = useState([]);

  useEffect(() => {
    getAllTags();
  }, []);

    const updateView = (chosenTag) => {

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
    
      const allTags = [];
      for(const key in tagInfo.data[0]){

        if(tagInfo.data[0][key] && key !== 'createdAt' && key !== 'updatedAt' && key !== 'email' && key !== 'id'  ){



            const parsed = JSON.parse(tagInfo.data[0][key]);
           
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
       
          <div className="max-h-[20vh] bg-cstmneutral/90 overflow-y-auto mb-1 md:mb-2 lg:mb-4 rounded-xl dark:bg-gradient-to-b from-zinc-900 to-purple-950 p-4 shadow-xl border border-purple-700">

      <h2 className="text-2xl font-bold text-covenantDark bg-cstmwhite/70 dark:text-cstmneutral dark:bg-black/50 mb-4 text-center">Selected Tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tags.map((tag) => (
          tag.isSelected ? <Tag key={tag.color} tag={tag} updateView={updateView} icon={icons[tag.icon]}/> : <></>
        ))}
      </div>
    </div>
    <div className="mt-2 md:mt-4 lg:mt-6 mx-auto max-h-[80vh] overflow-y-auto rounded-xl bg-cstmneutral/70 dark:bg-gradient-to-b from-zinc-900 to-purple-950 p-4 shadow-xl border border-purple-700">

      <h2 className="text-2xl font-bold bg-white/50  text-covenantDark dark:text-purple-200 dark:bg-black/50 mb-4 text-center">Select Your Tags</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tags.map((tag) => (
          tag.isSelected ? <></> : <Tag key={tag.color} tag={tag} updateView={updateView} icon={icons[tag.icon]}/>
        ))}
      </div>
    </div>
    </div>
  );
}