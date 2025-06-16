import type { ReactNode } from 'react';

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

// components/BeliefModal.tsx
import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { useState } from 'react';

interface BeliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (text: string) => void;
}

export function BeliefModal({ isOpen, onClose, title, onSave }: BeliefModalProps) {
  const [text, setText] = useState('');

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        <Dialog.Title className="text-xl font-bold mb-4 text-center">Describe your belief on "{title}"</Dialog.Title>
        <textarea
          maxLength={1000}
          className="w-full border border-gray-300 rounded-md p-3 mb-4 h-40 resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={() => { onSave(text); onClose(); }}>Save Belief</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}