import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { useEffect, useState } from 'react';

interface BeliefModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSave: (text: string) => void;
  description?: string;
}

export function BeliefModal({ isOpen, onClose, title, onSave, description }: BeliefModalProps) {
  const [text, setText] = useState(description ?? '');

  // This modal is reused across sub-topics without remounting, so the
  // textarea must resync whenever it's reopened for a (possibly different)
  // sub-topic - otherwise it stays blank for an already-answered belief, and
  // clicking Save silently wipes out what was saved before.
  useEffect(() => {
    if (isOpen) {
      setText(description ?? '');
    }
  }, [isOpen, description]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title className="text-xl font-bold mb-4 text-center">Describe your belief on "{title}"</Dialog.Title>
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
