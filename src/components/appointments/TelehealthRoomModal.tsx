import React, { useState } from 'react';
import { Appointment } from '../../types';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  ShieldCheck,
  Activity,
  Maximize2,
  X,
  Send,
  User,
  Heart,
} from 'lucide-react';

interface TelehealthRoomModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const TelehealthRoomModal: React.FC<TelehealthRoomModalProps> = ({
  appointment,
  onClose,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'System', text: 'Encrypted peer-to-peer WebRTC connection established. TLS 1.3 active.' },
    { sender: appointment.doctorName, text: 'Hello Eleanor! I can see and hear you clearly. How have you been feeling since our last visit?' },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'You', text: inputText.trim() }]);
    setInputText('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: appointment.doctorName,
          text: 'Understood. I am updating your encounter notes in the EHR right now.',
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 rounded-3xl max-w-5xl w-full h-[85vh] shadow-2xl border border-slate-800 flex flex-col overflow-hidden text-white relative">
        {/* Top Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">
                  Telehealth Consultation · {appointment.doctorName}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  HIPAA Encrypted
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {appointment.specialty} · Encounter ID: #ENC-90821-VID
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 rounded-xl transition-colors ${
                chatOpen ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle In-Call Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Canvas & Side Chat */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Video Screen */}
          <div className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Physician Video Feed */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={appointment.doctorAvatar}
                alt={appointment.doctorName}
                className="w-full h-full object-cover opacity-85 filter contrast-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Physician Overlay Badge */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">{appointment.doctorName}</span>
                <span className="text-slate-400">({appointment.specialty})</span>
              </div>

              {/* Vitals HUD Heads-Up Display */}
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs space-y-1.5 shadow-lg">
                <div className="flex items-center gap-1.5 text-teal-400 font-bold uppercase tracking-wider text-[10px]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Real-Time Biometrics Feed</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[10px] block">BP</span>
                    <span className="font-bold text-white">120/76</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">PULSE</span>
                    <span className="font-bold text-emerald-400">68 bpm</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">SpO2</span>
                    <span className="font-bold text-cyan-400">99%</span>
                  </div>
                </div>
              </div>

              {/* Patient Self-View (PiP) */}
              <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-2xl overflow-hidden border-2 border-teal-500/80 shadow-2xl bg-slate-800">
                {cameraActive ? (
                  <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center relative">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                      alt="Patient self-view"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-2 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded text-white font-mono">
                      You (Eleanor)
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                    <VideoOff className="w-6 h-6 mb-1 text-slate-600" />
                    <span>Camera off</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Collapsible Chat Drawer */}
          {chatOpen && (
            <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-300">
                Encrypted Encounter Chat
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                {chatMessages.map((m, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <span className="text-[10px] font-bold text-teal-400">
                      {m.sender}
                    </span>
                    <p className="bg-slate-900 p-2 rounded-lg text-slate-200 text-xs border border-slate-800 leading-snug">
                      {m.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-800 flex gap-1.5">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type message to doctor..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="p-1.5 bg-teal-600 hover:bg-teal-500 rounded-lg text-white"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Video Call Controls Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-4 shrink-0">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-3.5 rounded-full transition-all ${
              micActive
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-3.5 rounded-full transition-all ${
              cameraActive
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 text-white hover:bg-rose-700'
            }`}
            title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {cameraActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-lg transition-transform hover:scale-105"
            title="Leave Encounter"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Consultation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
