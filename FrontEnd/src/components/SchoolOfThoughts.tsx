// components/SchoolOfThoughts.tsx
import { useState } from 'react';
import { ThoughtCard } from './ThoughtCard';
import { ThoughtModal } from './ThoughtModal';
import { PageHeader } from './ui/PageHeader';
import { FaBrain } from '@react-icons/all-files/fa/FaBrain' 
  import { FaFlask } from '@react-icons/all-files/fa/FaFlask' 
  import { FaHeart } from '@react-icons/all-files/fa/FaHeart' 
  import { FaFire }  from '@react-icons/all-files/fa/FaFire'
  import { FaInfinity } from '@react-icons/all-files/fa/FaInfinity' 
  import { FaQuestion } from '@react-icons/all-files/fa/FaQuestion';
  import { FaUserSecret } from 'react-icons/fa';
  import { FaUserGraduate } from 'react-icons/fa';
import axios from 'axios';
import { tokenManager } from '../utils/tokenManager';
import baseURL from '../constants/constant';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth';
const schools = [
  {
    title: 'The Rationalists',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    icon: <FaBrain />,
    description: 'Logic and reason are the highest tools for understanding the world.',
    history: 'Thinkers like Descartes, Spinoza, and Sam Harris represent this lineage.'
  },
  {
    title: 'The Empiricists',
    color: 'linear-gradient(135deg, #56ccf2, #2f80ed)',
    icon: <FaFlask />,
    description: 'Knowledge comes from the senses and lived reality.',
    history: 'Thinkers like Hume, Locke, and Feynman championed this approach.'
  },
  {
    title: 'The Humanists',
    color: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
    icon: <FaHeart />,
    description: 'Human well-being, empathy, and dignity are paramount.',
    history: 'Rogers, Nussbaum, and Confucius represent this tradition.'
  },
  {
    title: 'The Existentialists',
    color: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
    icon: <FaFire />,
    description: 'Life has no inherent meaning, so we must create our own.',
    history: 'Kierkegaard, Nietzsche, and Camus helped define this school.'
  },
  {
    title: 'The Mystics',
    color: 'linear-gradient(135deg, #43cea2, #185a9d)',
    icon: <FaInfinity />,
    description: 'There’s more to life than what we can explain.',
    history: 'Mystics like Rumi, Laozi, and Alan Watts explored these depths.'
  },
  {
    title: 'The Skeptics',
    color: 'linear-gradient(135deg, #bdc3c7, #2c3e50)',
    icon: <FaQuestion />,
    description: 'Doubt is a virtue; nothing is sacred.',
    history: 'Socrates, Diogenes, and Zizek personify this tradition.'
  },
    {
    title: 'The Tricksters',
    color: 'linear-gradient(135deg, #ff6a00, #ee0979)',
    icon: <FaUserSecret />,
    description: 'Challenging norms and pushing buttons through irony or mischief.',
    history: 'Inspired by figures like Diogenes, Loki, or modern satirists and trolls.'
  },
  {
    title: 'The Undecided',
    color: 'linear-gradient(135deg, #c9d6ff, #e2e2e2)',
    icon: <FaUserGraduate />,
    description: 'Still learning, exploring, or unsure where they belong.',
    history: 'All great thinkers start somewhere — this is a space for curiosity and growth.'
  },
];

export default function SchoolOfThoughts() {
  const [selected, setSelected] = useState<number | null>(null);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const handleNext = () => {
    const school = schools[selected!].title;
    axios.post(`${baseURL}/api/schoolsofthought/`, {
      school
    }, {
      headers: {
        'Authorization': `Bearer ${tokenManager.getToken()}`, // 🔑 Token in header
        'Content-Type': 'application/json'
      }
    }).then(() => {
      // Keep the in-memory session in sync - otherwise the rest of
      // onboarding (and the profile page right after it) still shows the
      // pre-onboarding school until the next full page load/token verify.
      setUser((prev) => prev ? { ...prev, school } : prev);
    }).catch((err) => {
      console.error('failed to save school of thought', err);
      // Non-critical preference - don't strand the user in onboarding over
      // it, but note it's one-shot: unlike a success, a failed save here
      // isn't retried, so the School Of Thought stays unset until edited
      // again from the profile page.
    }).finally(() => {
      navigate('/onboarding/tags');
    });
  };

  return (
    <div className="py-2 px-6 max-w-6xl mx-auto">
      <PageHeader title="Schools Of Thought" />
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
        {schools.map((school, i) => (
          <ThoughtCard
            key={school.title}
            title={school.title}
            icon={school.icon}
            color={school.color}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>

      {selected !== null && (
        <ThoughtModal
          isOpen={selected !== null}
          onClose={() => setSelected(null)}
          title={schools[selected].title}
          description={schools[selected].description}
          history={schools[selected].history}
          icon={schools[selected].icon}
          onNext={handleNext}
          
        />
      )}
    </div>
  );
}