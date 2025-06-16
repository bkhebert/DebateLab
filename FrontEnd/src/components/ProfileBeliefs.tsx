import { useState } from 'react';
import { FaFlask, FaPrayingHands, FaBook, FaBrain, FaLandmark, FaGlobe } from 'react-icons/fa';
import { BeliefCard } from './BeliefCard';
import { SubBeliefCard } from './BeliefCard';
import { BeliefModal } from './BeliefModal';

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

export default function ProfileBeliefs() {
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [beliefsState, setBeliefsState] = useState<{ [sub: string]: string }>({});

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      {!selectedParent && (
        <>
          <h1 className="text-4xl font-bold text-center mb-10">Choose a Belief Category</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((belief, i) => (
              <BeliefCard
                key={belief.title}
                title={belief.title}
                icon={belief.icon}
                color={belief.color}
                onClick={() => setSelectedParent(i)}
              />
            ))}
          </div>
        </>
      )}

      {selectedParent !== null && (
        <>
          <button onClick={() => setSelectedParent(null)} className="mb-6 text-blue-600 underline">← Back to Belief Categories</button>
          <h2 className="text-3xl font-semibold text-center mb-8">{beliefs[selectedParent].title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {beliefs[selectedParent].subs.map((sub) => (
              <SubBeliefCard
                key={sub}
                title={sub}
                color={beliefs[selectedParent].color}
                icon={beliefs[selectedParent].icon}
                onClick={() => setSelectedSub(sub)}
              />
            ))}
          </div>
        </>
      )}

      {selectedSub && (
        <BeliefModal
          isOpen={!!selectedSub}
          onClose={() => setSelectedSub(null)}
          title={selectedSub}
          onSave={(text) => setBeliefsState(prev => ({ ...prev, [selectedSub]: text }))}
        />
      )}
    </div>
  );
}