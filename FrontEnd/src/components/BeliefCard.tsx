import type { ReactNode } from 'react';

interface BeliefCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

export function BeliefCard({ title, icon, color, onClick }: BeliefCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-white"
      style={{ background: color }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center">{title}</h3>
    </div>
  );
}

// components/SubBeliefCard.tsx
interface SubBeliefCardProps {
  title: string;
  color: string;
  icon: ReactNode;
  onClick: () => void;
}

export function SubBeliefCard({ title, icon, color, onClick }: SubBeliefCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl cursor-pointer transition transform hover:scale-105 hover:shadow-md p-4 text-white flex flex-col items-center justify-center"
      style={{ background: color }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="text-md font-semibold text-center">{title}</h4>
    </div>
  );
}
