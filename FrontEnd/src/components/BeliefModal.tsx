import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useState } from 'react';

interface BeliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (text: string) => void;
  description?: string;
}

export function BeliefModal({ isOpen, onClose, title, onSave, description }: BeliefModalProps) {
  const [text, setText] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="text-xl font-bold mb-4 text-center">Describe your belief on "{title}"</Dialog.Title>
      {description && (
        <div>
          <h4 className="text-center">Current Belief:</h4>
          <p className="text-center text-muted-foreground">{description}</p>
        </div>
      )}
      <textarea
        maxLength={1000}
        className="w-full bg-background border border-input rounded-md p-3 mb-4 h-40 resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose} variant="secondary">Cancel</Button>
        <Button onClick={() => { onSave(text); onClose(); }}>Save Belief</Button>
      </div>
    </Modal>
  );
}
