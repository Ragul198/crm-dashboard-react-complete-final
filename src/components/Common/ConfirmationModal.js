import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className={`w-6 h-6 ${typeStyles[type]}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="btn-primary"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;