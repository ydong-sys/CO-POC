
import React, { useEffect } from 'react';
import { CloseIcon } from './icons';

interface ToastProps {
  message: string;
  type?: 'success';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-gray-800' : 'bg-gray-800';

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <div className={`flex items-center justify-between text-white font-semibold py-3 px-5 rounded-lg shadow-lg ${bgColor} animate-fade-in-up`}>
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 -mr-2 p-1 rounded-full hover:bg-black hover:bg-opacity-20">
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;