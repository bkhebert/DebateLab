import { useEffect, useState } from 'react';
import { FaFlask, FaPrayingHands, FaBook, FaBrain, FaLandmark, FaGlobe } from 'react-icons/fa';
import { BeliefCard } from './BeliefCard';
import { SubBeliefCard } from './BeliefCard';
import { BeliefModal } from './BeliefModal';
import MobileLayout from './MobileLayout';
import axios from 'axios';
import baseURL from '../constants/constant';
import useAuth from '../contexts/useAuth';
import { tokenManager } from '../utils/tokenManager';
import { Link } from 'react-router-dom';
const beliefs = [
  {
    title: 'Science & Technology',
    icon: <FaFlask />, color: '#3498db',
    subs: [
      {sub: 'Physics & Cosmology', description: ''}, 
    { sub:  'Artificial Intelligence', description: ''}, 
    { sub:  'Biotechnology & Ethics', description: ''},
    { sub:  'Climate Science', description: ''}, 
    { sub:  'Futurism & Transhumanism', description: ''}, 
    { sub:  'Skepticism & Pseudoscience', description: ''},
    ]
  },
  {
    title: 'Religion & Spirituality',
    icon: <FaPrayingHands />, color: '#9b59b6',
    subs: [
   { sub:   'Comparative Religion', description: ''}, 
   { sub:   'Atheism & Secularism', description: ''}, 
   { sub:   'Theology & Doctrine', description: ''},
   { sub:   'Mysticism & Esotericism', description: ''}, 
   { sub:   'Religious Ethics', description: ''}, 
   { sub:   'New Age & Alternative Beliefs', description: ''},
    ]
  },
  {
    title: 'Philosophy',
    icon: <FaBook />, color: '#e67e22',
    subs: [
   { sub:   'Ontology', description: ''}, 
   { sub:   'Epistemology', description: ''}, 
   { sub:   'Ethics & Morality', description: ''}, 
   { sub:   'Metaphysics', description: ''}, 
   { sub:   'Political Philosophy', description: ''}, 
   { sub:   'Philosophy of Mind', description: ''},
    ]
  },
  {
    title: 'Psychology',
    icon: <FaBrain />, color: '#16a085',
    subs: [
   { sub:   'Cognitive Psychology', description: ''}, 

   { sub:   'Behavioral Psychology', description: ''}, 
   { sub:   'Neuropsychology', description: ''}, 
   { sub:   'Social Psychology', description: ''}, 
   { sub:   'Psychoanalysis', description: ''}, 
   { sub:   'Evolutionary Psychology', description: ''},
    ]
  },
  {
    title: 'Politics (US)',
    icon: <FaLandmark />, color: '#c0392b',
    subs: [
   { sub:   'Electoral Politics', description: ''}, 
   { sub:   'Constitutional Issues', description: ''}, 
   { sub:   'Economic Policy', description: ''}, 
   { sub:   'Social Policy (Race, Gender, etc.)', description: ''}, 
   { sub:   'Foreign Policy (US-centric)', description: ''}, 
   { sub:   'Political Theory (US context)', description: ''},
    ]
  },
  {
    title: 'Politics (World)',
    icon: <FaGlobe />, color: '#2ecc71',
    subs: [
   { sub:  'International Relations', description: ''}, 
   { sub:  'Geopolitics', description: ''}, 
   { sub:  'Comparative Government', description: ''}, 
   { sub:  'Global Economic Systems', description: ''}, 
   { sub:  'Human Rights & NGOs', description: ''}, 
   { sub:  'War & Conflict Studies', description: ''},
    ]
  }
];

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
      console.log(beliefInfo.data)
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
    console.log('success!')
    getPhilosophyData()
  }).catch((err) => {
    console.error(err);
  })

  }

  return (
    <div className="px-6 max-w-6xl mx-auto">
      {selectedParent === null && (
        <>
     { !isSelectingTopics && !topicSelected && <div><h1 className="text-4xl font-bold text-center mb-1">Add your beliefs</h1>
<p className="text-xs mb-2 italic">
  This section may take time. It’s no small task to sit with oneself and carve out truths you stand by in a world as ambiguous as ours. But take comfort—your answers aren’t final. You can revise, reflect, evolve. No A.I. will interpret your beliefs here; they are valid because they are yours. Share them not for approval, but for understanding—so others may glimpse who you are in this brief and shifting moment of being.
</p></div> }
{ isSelectingTopics &&
<div><h1 className="text-4xl font-bold text-center mb-1">Select A Topic To Debate</h1>

<p className="text-xs mb-2 italic text-center">
If you can't find something you like,there is always...  
</p><Link to={'/thegreatconversation'}><button className="flex justify-center mx-auto p-3 bg-primary m-2 rounded text-white">The Great Conversation</button></Link></div>
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
          <button onClick={() => setSelectedParent(null)} className={`mt-1 text-blue-600 underline border border-black`}>
            {`${(isSelectingTopics && topicSelected) ? "Back" : "Back" }`}</button>
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