import { Icon } from '@iconify/react';

interface SectionHeaderProps {
  icon: string;
  title: string;
}

export default function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <Icon icon={icon} className="w-8 h-8 text-dark-accent" />
      <h2 className="text-3xl font-bold text-dark-primary">{title}</h2>
    </div>
  );
}