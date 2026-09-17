import type { ReactNode } from 'react';

interface SelectableTileProps {
  title: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
  size?: 'sm' | 'lg';
}

const sizeClasses = {
  lg: {
    tile: 'rounded-2xl hover:shadow-lg p-6',
    icon: 'text-5xl mb-4',
    title: 'text-xl',
  },
  sm: {
    tile: 'rounded-xl hover:shadow-md p-4',
    icon: 'text-3xl mb-2',
    title: 'text-md',
  },
};

export function SelectableTile({ title, icon, color, onClick, size = 'lg' }: SelectableTileProps) {
  const classes = sizeClasses[size];
  const HeadingTag = size === 'lg' ? 'h3' : 'h4';

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition duration-300 transform hover:scale-105 text-white flex flex-col items-center justify-center ${classes.tile}`}
      style={{ background: color }}
    >
      <div className={classes.icon}>{icon}</div>
      <HeadingTag className={`font-semibold text-center ${classes.title}`}>{title}</HeadingTag>
    </div>
  );
}
