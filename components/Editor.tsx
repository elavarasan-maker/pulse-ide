
import React from 'react';
import { ProjectFile } from '../types';

interface EditorProps {
  file: ProjectFile | null;
}

const Editor: React.FC<EditorProps> = ({ file }) => {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] text-zinc-600">
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-sm">Select a file or prompt Pulse to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0d0d0d] overflow-hidden">
      <div className="bg-[#111] px-4 py-2 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">{file.path}</span>
          <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-500 font-bold uppercase">{file.language}</span>
        </div>
        <button 
          onClick={() => navigator.clipboard.writeText(file.content)}
          className="text-xs text-zinc-500 hover:text-white transition-colors"
        >
          Copy
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6 code-font text-sm leading-relaxed whitespace-pre">
        {file.content.split('\n').map((line, i) => (
          <div key={i} className="flex hover:bg-[#1a1a1a] px-2 -mx-2 rounded transition-colors group">
            <span className="w-8 text-right pr-4 text-zinc-700 select-none text-[12px] pt-1">{i + 1}</span>
            <code className="text-zinc-300">
              {line || ' '}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editor;
