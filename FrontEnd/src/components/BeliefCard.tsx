import type { ReactNode } from 'react';
import { SelectableTile } from './ui/SelectableTile';

interface BeliefCardProps {
  title: string;
  icon: ReactNode;
  color: string;
  onClick: () => void;
}

export function BeliefCard(props: BeliefCardProps) {
  return <SelectableTile {...props} size="lg" />;
}

export function SubBeliefCard(props: BeliefCardProps) {
  return <SelectableTile {...props} size="sm" />;
}
