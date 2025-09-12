import { Icon } from '@iconify/react';

interface GenericErrorStateProps {
  error: string;
}

export default function GenericErrorState({ error }: GenericErrorStateProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-6 flex items-center justify-center">
      <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-8 rounded-2xl text-center max-w-md">
        <div className="text-6xl mb-4">
          <Icon icon="mdi:alert-circle" />
        </div>
        <h3 className="text-xl font-bold mb-2">Error</h3>
        <p>{error}</p>
      </div>
    </div>
  );
}