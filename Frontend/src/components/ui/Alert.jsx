import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const config = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
    },
  };

  const { bg, border, text, icon: Icon } = config[type];

  return (
    <div
      className={`${bg} ${border} ${text} px-4 py-3 rounded-lg border flex items-center gap-3 ${className}`}
    >
      <Icon size={20} />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70">
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default Alert;
