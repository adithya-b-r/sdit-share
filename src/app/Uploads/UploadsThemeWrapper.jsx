"use client";

import { useTheme } from 'next-themes';
import DarkVeil from '../../components/DarkVeil';
import { ThemeToggle } from '../../components/ThemeToggle';
import { ArrowLeft } from 'lucide-react';

export default function UploadsThemeWrapper({ children }) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden font-sans bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Light Mode Gradient Fallback */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 dark:opacity-0 transition-opacity duration-500 pointer-events-none z-[0]" />

      {/* DarkVeil Animated Background (Dark Mode Only) */}
      <div
        className={`fixed inset-0 transition-opacity duration-500 z-[0] ${theme === 'dark' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
      >
        {theme === 'dark' && (
          <DarkVeil
            hueShift={0}
            noiseIntensity={0}
            scanlineIntensity={0}
            speed={0.5}
            scanlineFrequency={0}
            warpAmount={0}
            resolutionScale={1}
          />
        )}
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-6 py-8 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Child Server Component (Dashboard UI) */}
        {children}

      </div>
    </div>
  );
}
