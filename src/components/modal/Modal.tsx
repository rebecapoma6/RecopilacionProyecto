import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;  
}

const Modal: React.FC<ModalProps> = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={onClose} // cerrar al hacer click fuera
    >
      <div 
        className="bg-neutral-50 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()} // evitar que cierre al click dentro
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2 className="text-xl-title font-bold text-neutral-700">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 text-2xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* Contenido (formulario o lo que sea) */}
        <div className="p-6 space-y-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;