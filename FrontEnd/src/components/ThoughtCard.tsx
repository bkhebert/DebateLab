// components/ThoughtCard.tsx
import type { ReactNode } from 'react';

interface ThoughtCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

export function ThoughtCard({ title, icon, color, onClick }: ThoughtCardProps) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl cursor-pointer transition duration-300 transform hover:scale-105 hover:shadow-lg p-6 flex flex-col items-center justify-center text-white`} 
      style={{ background: color }}
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-center">{title}</h3>
    </div>
  );
}