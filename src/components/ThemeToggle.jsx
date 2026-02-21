"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex items-center justify-center p-2 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 border border-slate-200/20 dark:border-slate-700/50 shadow-sm transition-all duration-300 overflow-hidden w-10 h-10 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun className="absolute w-5 h-5 text-orange-400 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute w-5 h-5 text-blue-200 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      </div>

      {/* Subtle glow effect on hover */}
      <span className="absolute inset-0 rounded-full bg-orange-400/20 dark:bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none" />
    </button>
  );
}
