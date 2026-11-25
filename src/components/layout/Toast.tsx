import React from 'react';
import { useUIStore } from '../../stores/useUIStore';
import { CheckCircle2, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useUIStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-primary text-surface px-5 py-3.5 shadow-lift flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-2 duration-200 border border-sand-dark/20">
      <CheckCircle2 className="w-4 h-4 text-sand" />
      <span className="font-medium tracking-subtle">{toastMessage}</span>
      <button onClick={hideToast} className="text-surface/70 hover:text-surface ml-2">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
