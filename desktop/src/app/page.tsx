'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Webcam');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMinimize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.minimize) {
      (window as any).electron.minimize();
    }
  };

  const handleMaximize = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.maximize) {
      (window as any).electron.maximize();
    }
  };

  const handleClose = () => {
    if (typeof window !== 'undefined' && (window as any).electron?.close) {
      (window as any).electron.close();
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-white/20 relative overflow-hidden font-sans">
      
      {/* Subtle Aura Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[96px]" />
      </div>

      {/* Custom Titlebar - Minimal with Window Controls */}
      <div className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center justify-between px-4 drag-region">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-medium">EcoBridge</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMinimize}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors no-drag"
            title="Minimize"
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button 
            onClick={handleMaximize}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors no-drag"
            title="Maximize"
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-lg hover:bg-red-500/20 flex items-center justify-center transition-colors no-drag"
            title="Close"
          >
            <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">

        {/* Minimal Hero */}
        <div className="text-center space-y-8 max-w-lg mx-auto">
          <div className="relative inline-block">
            <h1 className="text-5xl font-medium tracking-tight text-white/90">
              EcoBridge
            </h1>
            {/* Subtle glow behind text */}
            <div className="absolute inset-0 bg-white/20 blur-3xl -z-10 opacity-20" />
          </div>
          
          <p className="text-lg text-white/40 font-light leading-relaxed">
            Continuity for the rest of us. <br />
            Seamlessly bridging Android to your Desktop.
          </p>
        </div>

        {/* Grid of Minimal Cards */}
        <div className="grid grid-cols-2 gap-4 mt-20 w-fit">
          <MinimalCard 
            icon="📹" 
            label="Webcam" 
            active={activeTab === 'Webcam'} 
            onClick={() => setActiveTab('Webcam')}
          />
          <MinimalCard 
            icon="📋" 
            label="Clipboard" 
            active={activeTab === 'Clipboard'} 
            onClick={() => setActiveTab('Clipboard')}
          />
        </div>

        {/* Dynamic Content Area */}
        <div className="mt-12 w-full max-w-2xl px-6">
          {activeTab === 'Clipboard' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <h3 className="text-xl font-medium">Universal Clipboard</h3>
              <p className="text-white/40 text-sm">
                Clipboard synchronization is active. <br/>
                Anything you copy on this PC will be available on your phone, and vice-versa.
              </p>
              <div className="flex justify-center gap-2">
                <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold tracking-widest uppercase">Encrypted</div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold tracking-widest uppercase">Real-time</div>
              </div>
            </div>
          )}

          {activeTab === 'Webcam' && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
              <h3 className="text-xl font-medium">Virtual Webcam</h3>
              <p className="text-white/40 text-sm">
                Select your phone from the list to start streaming.
              </p>
              <button className="px-8 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors">
                Start Preview
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="absolute bottom-8 w-full text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-medium">
          AcWoC 2026 • Build 1.0.0
        </p>
      </div>
    </div>
  );
}

function MinimalCard({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-32 h-32 rounded-3xl flex flex-col items-center justify-center gap-4
        ${active 
          ? 'bg-white/10 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]' 
          : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]'
        }
        backdrop-blur-md border hover:scale-[1.02]
        transition-all duration-300 cursor-pointer
        group
      `}
    >
      <span className={`text-2xl transition-opacity ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0'}`}>
        {icon}
      </span>
      <span className={`text-[11px] font-medium uppercase tracking-wider transition-colors ${active ? 'text-white/70' : 'text-white/30 group-hover:text-white/70'}`}>
        {label}
      </span>
    </button>
  );
}
