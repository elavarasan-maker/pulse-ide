
import React, { useState, useRef, useEffect } from 'react';

interface CommandCenterProps {
  onSend: (text: string) => void;
  isLoading: boolean;
}

const CommandCenter: React.FC<CommandCenterProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      // Mock finishing listen
      if (input === '') setInput('Create a modern React landing page for a space travel agency');
    } else {
      setIsListening(true);
      // In a real app, integrate Web Speech API or Gemini Live
      setTimeout(() => {
        setIsListening(false);
        onSend("Build a clean, dark-themed responsive dashboard using Tailwind and React");
      }, 3000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
      <div className={`relative group transition-all duration-300 ${isLoading ? 'scale-[1.02]' : ''}`}>
        <div className={`absolute -inset-1 rounded-2xl blur opacity-30 transition duration-1000 group-hover:duration-200 ${
          isLoading ? 'bg-blue-500 pulse-loading' : 'bg-gradient-to-r from-blue-600 to-purple-600 group-hover:opacity-60'
        }`}></div>
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center bg-[#18181b] border border-[#27272a] rounded-xl shadow-2xl p-2 pl-4"
        >
          <div className="mr-3 text-zinc-500">
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Pulse is engineering..." : "Ask Pulse to build anything... (⌘K)"}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-zinc-500 py-2"
          />
          <div className="flex items-center gap-2">
             <button
              type="button"
              onClick={toggleListen}
              className={`p-2 rounded-lg transition-all ${
                isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-zinc-500 hover:text-white hover:bg-[#27272a]'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white text-xs font-bold rounded-lg transition-all"
            >
              BUILD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommandCenter;
