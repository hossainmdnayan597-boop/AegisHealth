import React, { useState } from 'react';
import { useHealth } from '../../context/HealthContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  ShieldCheck,
  Clock,
  Sparkles,
  User,
  AlertTriangle,
  CheckCheck,
  Check,
  Plus,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export const SecureMessagingView: React.FC = () => {
  const {
    threads,
    activeThreadId,
    setActiveThreadId,
    sendMessage,
    simulateDoctorReply,
    role,
    patient,
  } = useHealth();

  const [messageInput, setMessageInput] = useState('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachedFileName) return;

    const attachments = attachedFileName
      ? [{ id: 'att-' + Date.now(), name: attachedFileName, size: '1.4 MB', type: 'pdf' as const }]
      : undefined;

    sendMessage(activeThread.id, messageInput.trim(), attachments);
    setMessageInput('');
    setAttachedFileName(null);
  };

  const handleSimulateAttachment = () => {
    const sampleFiles = [
      'Home_BloodPressure_Log_Oct.pdf',
      'Rash_Photo_Day3.jpg',
      'Previous_Hospital_Discharge_Summary.pdf',
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setAttachedFileName(picked);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              HIPAA Secure Patient-Provider Messaging
            </h2>
            <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              End-to-End Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Direct clinical dialogue with your primary care physician, specialists, and ambulatory nursing triage.
          </p>
        </div>

        {/* Emergency disclaimer banner */}
        <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>If you are experiencing severe chest pain, shortness of breath, or emergency symptoms, call 911 immediately.</span>
        </div>
      </div>

      {/* Main Messaging Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[620px] overflow-hidden">
        {/* Left Column: Thread List (4 cols) */}
        <div className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Care Team Conversations ({threads.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThreadId;
              const lastMsg = thread.messages[thread.messages.length - 1];

              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 text-left transition-colors flex items-start gap-3 relative ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-teal-600' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <img
                    src={thread.providerAvatar}
                    alt={thread.providerName}
                    className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200 mt-0.5"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs text-slate-900 truncate">
                        {thread.providerName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {thread.lastMessageTimestamp.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-[11px] text-teal-700 font-semibold truncate">
                      {thread.subject}
                    </p>

                    <p className="text-xs text-slate-500 truncate mt-1">
                      {lastMsg?.text || 'No messages yet.'}
                    </p>

                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {thread.category}
                      </span>
                      {thread.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-teal-600" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat View & Composer (8 cols) */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {/* Conversation Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <img
                src={activeThread.providerAvatar}
                alt={activeThread.providerName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    {activeThread.providerName}
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Encrypted
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {activeThread.providerRole} · Response ETA: &lt; 4 business hours
                </p>
              </div>
            </div>

            {/* Simulated Physician Response Generator Button */}
            <button
              onClick={() => simulateDoctorReply(activeThread.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-lg border border-teal-200 transition-colors shadow-xs"
              title="Test real-time automated clinician response"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Simulate Provider Reply</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[440px] bg-slate-50/20">
            <div className="text-center my-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                Encrypted Session · Medical Record Thread #{activeThread.id}
              </span>
            </div>

            {activeThread.messages.map((msg) => {
              const isPatient = msg.sender === 'patient';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isPatient ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700">
                      {isPatient ? patient.name : activeThread.providerName}
                    </span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isPatient
                        ? 'bg-teal-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attached file if any */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.id}
                            className="flex items-center gap-2 text-[11px] bg-black/10 px-2 py-1 rounded"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="font-mono truncate">{att.name}</span>
                            <span className="opacity-75">({att.size})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    {isPatient && <CheckCheck className="w-3 h-3 text-teal-600" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-200 bg-white space-y-2">
            {attachedFileName && (
              <div className="flex items-center justify-between bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200 text-xs text-teal-800">
                <span className="flex items-center gap-1.5 font-mono">
                  <Paperclip className="w-3.5 h-3.5 text-teal-600" />
                  Attached: {attachedFileName}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachedFileName(null)}
                  className="text-teal-900 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Type a secure message to ${activeThread.providerName}...`}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  title="Attach clinical document or image"
                  className="p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!messageInput.trim() && !attachedFileName}
                  className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-all hover:scale-105"
                  title="Send encrypted message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Messages become part of your permanent legal electronic health record.</span>
              <span className="font-mono">TLS 1.3 Certified</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
