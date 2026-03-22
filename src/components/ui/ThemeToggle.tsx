'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group relative inline-flex h-9 w-16 items-center rounded-full bg-card/10 border border-border transition-all hover:bg-card/20"
            aria-label="Toggle theme"
        >
            <div className="absolute left-1 h-7 w-7 rounded-full bg-background border border-border shadow-sm transition-transform duration-300 transform dark:translate-x-7 flex items-center justify-center">
                {theme === 'dark' ? (
                    <Moon className="h-4 w-4 text-accent" />
                ) : (
                    <Sun className="h-4 w-4 text-accent" />
                )}
            </div>
            <div className="flex w-full justify-between items-center px-2.5">
                <Moon className={`h-3.5 w-3.5 transition-colors ${theme === 'dark' ? 'text-accent opacity-100' : 'text-zinc-400 opacity-40'}`} />
                <Sun className={`h-3.5 w-3.5 transition-colors ${theme === 'light' ? 'text-accent opacity-100' : 'text-zinc-400 opacity-40'}`} />
            </div>
        </button>
    );
}
