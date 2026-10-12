import React from 'react';
import { useHealth } from '../../context/HealthContext';
import { MessageSquare, Bell, RefreshCw, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useHealth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'sms':
              return <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />;
            case 'reminder':
              return <Bell className="w-5 h-5 text-amber-600 shrink-0" />;
            case 'ehr_sync':
              return <RefreshCw className="w-5 h-5 text-cyan-600 shrink-0" />;
            case 'success':
              return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-slate-600 shrink-0" />;
          }
        };

        const getBadgeStyle = () => {
          switch (toast.type) {
            case 'sms':
              return 'bg-emerald-50 border-emerald-200 text-emerald-900';
            case 'reminder':
              return 'bg-amber-50 border-amber-200 text-amber-900';
            case 'ehr_sync':
              return 'bg-cyan-50 border-cyan-200 text-cyan-900';
            default:
              return 'bg-slate-50 border-slate-200 text-slate-900';
          }
        };

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto shadow-lg border rounded-xl p-3.5 bg-white transition-all transform animate-in slide-in-from-bottom-3 duration-200 flex items-start gap-3 ${getBadgeStyle()}`}
          >
            <div className="mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 truncate">
                  {toast.title}
                </h4>
                <span className="text-[10px] text-slate-600 font-mono shrink-0">
                  {toast.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-600 hover:text-slate-800 p-0.5 rounded transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
