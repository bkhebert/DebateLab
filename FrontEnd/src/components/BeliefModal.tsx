import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { useState } from 'react';

interface BeliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (text: string) => void;
  description: string;
}

export function BeliefModal({ isOpen, onClose, title, onSave, description }: BeliefModalProps) {
  const [text, setText] = useState('');

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        <Dialog.Title className="text-xl font-bold mb-4 text-center dark:text-black">Describe your belief on "{title}"</Dialog.Title>
        { description && <div>
          <h4 className="text-center">Current Belief:</h4>
          <p className="text-center">{description}</p>
        </div>}
        <textarea
          maxLength={1000}
          className="dark:text-black w-full border border-gray-300 rounded-md p-3 mb-4 h-40 resize-none"
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