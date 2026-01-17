
import React from 'react';
import { ProjectFile } from '../types';

interface SidebarProps {
  files: ProjectFile[];
  selectedPath: string | null;
  onFileSelect: (path: string) => void;
  projectTitle: string;
}

const Sidebar: React.FC<SidebarProps> = ({ files, selectedPath, onFileSelect, projectTitle }) => {
  return (
    <div className="w-64 bg-[#111] border-r border-[#222] flex flex-col h-full">
      <div className="p-4 border-b border-[#222]">
        <h2 className="text-xs font-bold uppercase tracking-widest text-blue-500">Project</h2>
        <p className="text-sm font-medium truncate mt-1">{projectTitle || 'Untitled Project'}</p>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.length === 0 ? (
          <div className="px-4 py-2 text-xs text-zinc-500 italic">No files generated yet</div>
        ) : (
          files.map((file) => (
            <button
              key={file.path}
              onClick={() => onFileSelect(file.path)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-[#1a1a1a] transition-colors ${
                selectedPath === file.path ? 'bg-[#222] text-blue-400 border-l-2 border-blue-500' : 'text-zinc-400'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate">{file.path}</span>
            </button>
          ))
        )}
      </div>
      <div className="p-4 bg-[#0a0a0a] border-t border-[#222]">
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          PULSE ENGINE ACTIVE
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
