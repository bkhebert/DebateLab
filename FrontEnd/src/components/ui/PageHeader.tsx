import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  centerSubtitle?: boolean;
}

export function PageHeader({ title, subtitle, centerSubtitle = false }: PageHeaderProps) {
  return (
    <div>
      <h1 className={`text-4xl font-bold text-center ${subtitle ? 'mb-1' : 'mb-10'}`}>{title}</h1>
      {subtitle && (
        <p className={`text-xs mb-2 italic ${centerSubtitle ? 'text-center' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}
