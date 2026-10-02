import { useEffect, useState } from 'react';
import { BeliefCard } from './BeliefCard';
import { SubBeliefCard } from './BeliefCard';
import { BeliefModal } from './BeliefModal';
import { PageHeader } from './ui/PageHeader';
import { Button } from './ui/Button';
import axios from 'axios';
import baseURL from '../constants/constant';
import useAuth from '../contexts/useAuth';
import { tokenManager } from '../utils/tokenManager';
import { Link } from 'react-router-dom';
import { debateTopics as beliefs } from '../constants/debateTopics';

export default function ProfileBeliefs({isSelectingTopics, topicChosen, feedtopic}) {
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<{ subTopic: string, description: string } | null>(null);
  const [beliefsState, setBeliefsState] = useState<{ [sub: string]: string }>({});
  const [topicSelected, setTopicSelected] = useState<boolean>(false);
  const { user } = useAuth();
  const toggleTopicSelected = () => {
    setTopicSelected(!topicSelected);
    if(topicChosen){ topicChosen(selectedSub.subTopic)  }

  }

  useEffect(() => {
    return () => {
      setTopicSelected(false);
    }
  },[]);

  const getPhilosophyData = () => {
    axios.get(`${baseURL}/api/beliefs/getBeliefs`, {
  headers: {
    'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
    'Content-Type': 'application/json'
  }
})
    .then((beliefInfo) => {

     beliefInfo.data.forEach((belief) => {
      for(let i = 0; i < beliefs.length; i++){
      if(belief.category === beliefs[i].title){
        for(let q = 0; q < beliefs[i].subs.length; q++){
          if(beliefs[i].subs[q].sub === belief.subtopic){
            beliefs[i].subs[q].description = belief.description
          }
        }
      }
    }
     })
      // beliefInfo.data.description;
    })
    .catch((err) => {
      console.error(err)
    })
  }

  useEffect(() => {
    if(selectedSub?.subTopic && feedtopic){
      feedtopic(selectedSub.subTopic)
    }
  }, [selectedSub, feedtopic])

  useEffect(() => {
   if(!isSelectingTopics) {
    getPhilosophyData() 
   }
  }, [isSelectingTopics])
 
  const saveBeliefToDatabase = (text: string, selectedSub: string) => {
    axios.post(`${baseURL}/api/beliefs/updateBelief`, {
      text,
      "selectedSub": selectedSub,
      user,
      category: beliefs[selectedParent].title
    }, 
  {
  headers: {
    'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
    'Content-Type': 'application/json'
  }
}
  ).then(() => {
  
    getPhilosophyData()
  }).catch((err) => {
    console.error(err);
  })

  }

  return (
    <div className="px-6 max-w-6xl mx-auto">
      {selectedParent === null && (
        <>
     { !isSelectingTopics && !topicSelected && (
       <PageHeader
         title="Add your beliefs"
         subtitle="This section may take time. It’s no small task to sit with oneself and carve out truths you stand by in a world as ambiguous as ours. But take comfort—your answers aren’t final. You can revise, reflect, evolve. No A.I. will interpret your beliefs here; they are valid because they are yours. Share them not for approval, but for understanding—so others may glimpse who you are in this brief and shifting moment of being."
       />
     )}
{ isSelectingTopics &&
<div>
  <PageHeader
    title="Select A Topic To Debate"
    subtitle="If you can't find something you like,there is always...  "
    centerSubtitle
  />
  <Link to={'/thegreatconversation'}><Button className="flex justify-center mx-auto p-3 hover:bg-primary bg-primary m-2 rounded text-white">The Great Conversation</Button></Link>
</div>
}
         <div 
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {beliefs.map((belief, i) => (
              <BeliefCard
                key={belief.title}
                title={belief.title}
                icon={belief.icon}
                color={belief.color}
                onClick={() => {
                  setSelectedParent(i) 
                  setTopicSelected(false)
                }
                }
              />
            ))}
          </div>
        </>
      )}
  
      {selectedParent !== null && (
        <>
          <Button onClick={() => setSelectedParent(null)} className="mt-1 text-blue-600 bg-transparent hover:bg-transparent underline border border-black">
            {`${(isSelectingTopics && topicSelected) ? "Back" : "Back" }`}</Button>
          <h2 className="text-3xl font-semibold text-center mb-8">{beliefs[selectedParent].title}</h2>
          <div className={`${(isSelectingTopics && topicSelected) ? "hidden " : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-6"} `}>
            {beliefs[selectedParent].subs.map((sub) => (
              <SubBeliefCard
                key={sub.sub}
                title={sub.sub}
                color={beliefs[selectedParent].color}
                icon={beliefs[selectedParent].icon}
                onClick={() => {
                  setSelectedSub({subTopic: sub.sub, description: sub.description})
                  toggleTopicSelected()

                }
                }
              />
            ))}
          </div>
        </>
      )}
      {selectedSub?.subTopic && <div className={`${(isSelectingTopics && topicSelected) ? "block text-center mb-1 font-semi-bold border border-dashed border-black" : "hidden"}`}>{selectedSub.subTopic}</div>}
      {selectedSub?.subTopic && !isSelectingTopics && (
        <BeliefModal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={selectedSub.subTopic}
          description={selectedSub.description}
          onSave={(text) => {
            setBeliefsState(prev => ({ ...prev, [selectedSub.subTopic]: text }))
            saveBeliefToDatabase(text, selectedSub.subTopic)
          
          }}
        />
      )}


    </div>
  );
}