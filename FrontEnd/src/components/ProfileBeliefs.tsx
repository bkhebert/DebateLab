import { useEffect, useState } from 'react';
import { FaFlask, FaPrayingHands, FaBook, FaBrain, FaLandmark, FaGlobe } from 'react-icons/fa';
import { BeliefCard } from './BeliefCard';
import { SubBeliefCard } from './BeliefCard';
import { BeliefModal } from './BeliefModal';
import MobileLayout from './MobileLayout';

const beliefs = [
  {
    title: 'Science & Technology',
    icon: <FaFlask />, color: '#3498db',
    subs: [
      'Physics & Cosmology', 'Artificial Intelligence', 'Biotechnology & Ethics',
      'Climate Science', 'Futurism & Transhumanism', 'Skepticism & Pseudoscience'
    ]
  },
  {
    title: 'Religion & Spirituality',
    icon: <FaPrayingHands />, color: '#9b59b6',
    subs: [
      'Comparative Religion', 'Atheism & Secularism', 'Theology & Doctrine',
      'Mysticism & Esotericism', 'Religious Ethics', 'New Age & Alternative Beliefs'
    ]
  },
  {
    title: 'Philosophy',
    icon: <FaBook />, color: '#e67e22',
    subs: ['Ontology', 'Epistemology', 'Ethics & Morality', 'Metaphysics', 'Political Philosophy', 'Philosophy of Mind']
  },
  {
    title: 'Psychology',
    icon: <FaBrain />, color: '#16a085',
    subs: ['Cognitive Psychology', 'Behavioral Psychology', 'Neuropsychology', 'Social Psychology', 'Psychoanalysis', 'Evolutionary Psychology']
  },
  {
    title: 'Politics (US)',
    icon: <FaLandmark />, color: '#c0392b',
    subs: ['Electoral Politics', 'Constitutional Issues', 'Economic Policy', 'Social Policy (Race, Gender, etc.)', 'Foreign Policy (US-centric)', 'Political Theory (US context)']
  },
  {
    title: 'Politics (World)',
    icon: <FaGlobe />, color: '#2ecc71',
    subs: ['International Relations', 'Geopolitics', 'Comparative Government', 'Global Economic Systems', 'Human Rights & NGOs', 'War & Conflict Studies']
  }
];

export default function ProfileBeliefs({isSelectingTopics}) {
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [beliefsState, setBeliefsState] = useState<{ [sub: string]: string }>({});
  const [topicSelected, setTopicSelected] = useState<boolean>(false);

  const toggleTopicSelected = () => {
    setTopicSelected(!topicSelected);
  }

  useEffect(() => {
    return () => {
      setTopicSelected(false);
    }
  },[])
 
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
<p className="text-xs mb-2 italic">
  
</p></div>
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
                key={sub}
                title={sub}
                color={beliefs[selectedParent].color}
                icon={beliefs[selectedParent].icon}
                onClick={() => {
                  setSelectedSub(sub)
                  toggleTopicSelected()}
                }
              />
            ))}
          </div>
        </>
      )}
      {selectedSub && <div className={`${(isSelectingTopics && topicSelected) ? "block text-center mb-1 font-semi-bold border border-dashed border-black" : "hidden"}`}>{selectedSub}</div>}
      {selectedSub && !isSelectingTopics && (
        <BeliefModal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={selectedSub}
          onSave={(text) => setBeliefsState(prev => ({ ...prev, [selectedSub]: text }))}
        />
      )}
      {isSelectingTopics && 
      <MobileLayout 
      topic={selectedSub}/>}

    </div>
  );
}