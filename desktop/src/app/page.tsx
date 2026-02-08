'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { SystemStats } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Webcam');
  const [mounted, setMounted] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Initialize socket connection
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server');
      socket.emit('register', 'desktop-ui');
    });

    socket.on('stats-update', (data: SystemStats) => {
      setStats(data);
    });

    socket.on('video-frame', (data: ArrayBuffer) => {
      if (!canvasRef.current) return;
      
      const blob = new Blob([data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          canvasRef.current.width = img.width;
          canvasRef.current.height = img.height;
          ctx.drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
      setIsStreaming(true);
    });

    return () => {
      socket.disconnect();
    };
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
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Virtual Webcam</h3>
                <p className="text-white/40 text-sm">
                  {isStreaming 
                    ? "Streaming active from mobile device." 
                    : "Start the webcam on your EcoBridge mobile app to see the preview."}
                </p>
              </div>
              
              <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm font-light z-10 bg-black/50 backdrop-blur-sm">
                    Waiting for mobile stream...
                  </div>
                )}
                {/* [AcWoC] [Difficulty: Hard] Low latency video pipeline implementation in progress. Virtual camera driver pending. */}
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full object-contain transition-transform duration-300"
                  style={{
                    transform: `scale(${flipHorizontal ? -1 : 1}, ${flipVertical ? -1 : 1})`
                  }}
                />

                {/* Overlay Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                  <button 
                    onClick={() => setFlipHorizontal(!flipHorizontal)}
                    className={`p-2 rounded-lg backdrop-blur-md border transition-all ${flipHorizontal ? 'bg-white/20 border-white/40 text-white' : 'bg-black/40 border-white/10 text-white/60 hover:bg-black/60'}`}
                    title="Flip Horizontal"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m0 0l-4-4m4 4l-4 4m0 6H8m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setFlipVertical(!flipVertical)}
                    className={`p-2 rounded-lg backdrop-blur-md border transition-all ${flipVertical ? 'bg-white/20 border-white/40 text-white' : 'bg-black/40 border-white/10 text-white/60 hover:bg-black/60'}`}
                    title="Flip Vertical"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8m0 0l-4-4m4 4l4-4m6 0V8m0 0l4 4m-4-4l-4 4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex justify-center items-center gap-4 pt-2">
                <div className="flex gap-2">
                  <div className={`px-3 py-1 ${isStreaming ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-white/20 border-white/10'} border rounded-full text-[10px] font-bold tracking-widest uppercase transition-colors flex items-center gap-2`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-white/20'}`} />
                    {isStreaming ? 'Live' : 'Offline'}
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center">
                    1080p
                  </div>
                </div>
              </div>
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
