import { FaFlask, FaPrayingHands, FaBook, FaBrain, FaLandmark, FaGlobe } from 'react-icons/fa';

export interface DebateSubTopic {
  sub: string;
  description: string;
}

export interface DebateSubject {
  title: string;
  icon: React.ReactNode;
  color: string;
  subs: DebateSubTopic[];
}

// Single source of truth for debate subjects/sub-topics, shared by
// ProfileBeliefs.tsx (the "add your beliefs" / legacy /debates picker) and
// RightSideBar.tsx (the signed-in topic filter).
export const debateTopics: DebateSubject[] = [
  {
    title: 'Science & Technology',
    icon: <FaFlask />, color: '#3498db',
    subs: [
      { sub: 'Physics & Cosmology', description: '' },
      { sub: 'Artificial Intelligence', description: '' },
      { sub: 'Biotechnology & Ethics', description: '' },
      { sub: 'Climate Science', description: '' },
      { sub: 'Futurism & Transhumanism', description: '' },
      { sub: 'Skepticism & Pseudoscience', description: '' },
    ]
  },
  {
    title: 'Religion & Spirituality',
    icon: <FaPrayingHands />, color: '#9b59b6',
    subs: [
      { sub: 'Comparative Religion', description: '' },
      { sub: 'Atheism & Secularism', description: '' },
      { sub: 'Theology & Doctrine', description: '' },
      { sub: 'Mysticism & Esotericism', description: '' },
      { sub: 'Religious Ethics', description: '' },
      { sub: 'New Age & Alternative Beliefs', description: '' },
    ]
  },
  {
    title: 'Philosophy',
    icon: <FaBook />, color: '#e67e22',
    subs: [
      { sub: 'Ontology', description: '' },
      { sub: 'Epistemology', description: '' },
      { sub: 'Ethics & Morality', description: '' },
      { sub: 'Metaphysics', description: '' },
      { sub: 'Political Philosophy', description: '' },
      { sub: 'Philosophy of Mind', description: '' },
    ]
  },
  {
    title: 'Psychology',
    icon: <FaBrain />, color: '#16a085',
    subs: [
      { sub: 'Cognitive Psychology', description: '' },
      { sub: 'Behavioral Psychology', description: '' },
      { sub: 'Neuropsychology', description: '' },
      { sub: 'Social Psychology', description: '' },
      { sub: 'Psychoanalysis', description: '' },
      { sub: 'Evolutionary Psychology', description: '' },
    ]
  },
  {
    title: 'Politics (US)',
    icon: <FaLandmark />, color: '#c0392b',
    subs: [
      { sub: 'Electoral Politics', description: '' },
      { sub: 'Constitutional Issues', description: '' },
      { sub: 'Economic Policy', description: '' },
      { sub: 'Social Policy (Race, Gender, etc.)', description: '' },
      { sub: 'Foreign Policy (US-centric)', description: '' },
      { sub: 'Political Theory (US context)', description: '' },
    ]
  },
  {
    title: 'Politics (World)',
    icon: <FaGlobe />, color: '#2ecc71',
    subs: [
      { sub: 'International Relations', description: '' },
      { sub: 'Geopolitics', description: '' },
      { sub: 'Comparative Government', description: '' },
      { sub: 'Global Economic Systems', description: '' },
      { sub: 'Human Rights & NGOs', description: '' },
      { sub: 'War & Conflict Studies', description: '' },
    ]
  }
];
