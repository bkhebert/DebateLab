import type { ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-card text-card-foreground rounded-lg max-w-lg w-full p-6 shadow-card">
        {children}
      </Dialog.Panel>
    </Dialog>
  );
}
