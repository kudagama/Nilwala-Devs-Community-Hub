'use client';

import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    async function initSplash() {
      const hasSeenSplash = sessionStorage.getItem('nilwala_splash_shown');
      if (hasSeenSplash) {
        setVisible(false);
        return;
      }

      // Begin fade-out after 2.2 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2200);

      // Fully remove after fade transition
      const removeTimer = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('nilwala_splash_shown', 'true');
      }, 2900);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }

    initSplash();
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, rgba(79,70,229,0.25) 0%, rgba(5,5,5,1) 65%)',
        backgroundColor: '#050505',
      }}
    >
      {/* Animated glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-[140px]"
          style={{ animation: 'blob1 3s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px]"
          style={{ animation: 'blob2 3.5s ease-in-out infinite alternate' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-[100px]"
          style={{ animation: 'blob1 2.8s ease-in-out infinite alternate-reverse' }}
        />
      </div>

      {/* Logo mark */}
      <div
        className="relative mb-6"
        style={{ animation: 'splashIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
          <span className="text-4xl font-black text-white tracking-tighter">N</span>
        </div>
        {/* Glowing ring */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-indigo-400/30 scale-110" />
        <div className="absolute inset-0 rounded-3xl ring-1 ring-purple-400/20 scale-125" />
      </div>

      {/* Brand name */}
      <h1
        className="text-5xl font-black tracking-tighter mb-2"
        style={{
          background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 40%, #e879f9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'splashIn 0.6s 0.15s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >
        Nilwala Devs
      </h1>

      {/* Tagline */}
      <p
        className="text-zinc-500 text-sm font-medium tracking-widest uppercase mb-10"
        style={{ animation: 'splashIn 0.6s 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        Ask · Answer · Grow
      </p>

      {/* Progress bar */}
      <div
        className="relative w-48 h-1 bg-white/10 rounded-full overflow-hidden"
        style={{ animation: 'splashIn 0.4s 0.5s ease both' }}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          style={{ animation: 'progressFill 1.8s 0.5s cubic-bezier(0.4,0,0.2,1) both' }}
        />
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes blob1 {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.15) translate(20px, -20px); }
        }
        @keyframes blob2 {
          from { transform: scale(1) translate(0, 0); }
          to   { transform: scale(1.1) translate(-25px, 15px); }
        }
      `}</style>
    </div>
  );
}
