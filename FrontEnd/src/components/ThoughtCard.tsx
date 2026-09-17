import type { ReactNode } from 'react';
import { SelectableTile } from './ui/SelectableTile';

interface ThoughtCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

export function ThoughtCard(props: ThoughtCardProps) {
  return <SelectableTile {...props} size="lg" />;
}
