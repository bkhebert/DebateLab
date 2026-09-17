import type { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

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
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-2 text-primary">{icon}</div>
        <Dialog.Title className="text-2xl font-bold mb-2 text-primary">{title}</Dialog.Title>
        <p className="text-muted-foreground mb-4">{description}</p>
        <p className="text-muted-foreground text-sm mb-6">{history}</p>
        <div className="flex flex-col gap-2 w-full">
          <Button onClick={onClose} variant="outline">Not This One</Button>
          <Button onClick={onNext}>Join the School Of {title}</Button>
        </div>
      </div>
    </Modal>
  );
}
