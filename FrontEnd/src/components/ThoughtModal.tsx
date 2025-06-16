import type { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';

interface ThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  history: string;
  icon: ReactNode;
  onNext: () => void;
}

export function ThoughtModal({ isOpen, onClose, title, description, history, icon, onNext }: ThoughtModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-2">{icon}</div>
          <Dialog.Title className="text-2xl font-bold mb-2">{title}</Dialog.Title>
          <p className="text-gray-700 mb-4">{description}</p>
          <p className="text-gray-500 text-sm mb-6">{history}</p>
          <Button onClick={onNext}>Continue to Profile</Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}