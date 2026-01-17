
import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import CommandCenter from './components/CommandCenter';
import { ProjectState } from './types';
import { generateProject, refineCode } from './services/geminiService';

const App: React.FC = () => {
  const [project, setProject] = useState<ProjectState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCommand = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      if (project) {
        // If we already have a project, refine it
        const updated = await refineCode(project.files, text);
        setProject(updated);
      } else {
        // Initial build
        const generated = await generateProject(text);
        setProject(generated);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate code. Please check your API key.");
    } finally {
      setLoading(false);
    }
  }, [project]);

  const selectedFile = useMemo(() => {
    if (!project || !project.selectedFilePath) return null;
    return project.files.find(f => f.path === project.selectedFilePath) || null;
  }, [project]);

  const selectFile = (path: string) => {
    if (!project) return;
    setProject({ ...project, selectedFilePath: path });
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        files={project?.files || []} 
        selectedPath={project?.selectedFilePath || null}
        onFileSelect={selectFile}
        projectTitle={project?.title || ''}
      />

      {/* Main Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="h-12 border-b border-[#222] flex items-center px-6 justify-between bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-[10px] font-bold">P</div>
            <span className="text-xs font-semibold tracking-widest text-zinc-300 uppercase">Pulse IDE</span>
          </div>
          <div className="flex items-center gap-4">
             {error && <span className="text-[10px] text-red-500 font-medium">Error: {error}</span>}
             <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#1a1a1a] border border-[#222]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] text-zinc-400 font-mono">GEMINI-3-PRO_V2</span>
             </div>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden relative">
           <Editor file={selectedFile} />
           
           {/* Welcome Overlay */}
           {!project && !loading && (
             <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a] z-10">
               <div className="max-w-md text-center">
                  <h1 className="text-4xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-4">
                    Pulse IDE
                  </h1>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                    The ultra-fast AI engine for software architecture. <br/>
                    Speak your vision, we'll build the code.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <button 
                      onClick={() => handleCommand("Create a fullstack Todo app with React and Tailwind")}
                      className="p-3 bg-[#111] border border-[#222] rounded-xl hover:border-blue-500/50 transition-all text-xs text-zinc-400 hover:text-blue-400"
                    >
                      "Fullstack Todo App..."
                    </button>
                    <button 
                      onClick={() => handleCommand("Build a real-time chat interface with dark mode support")}
                      className="p-3 bg-[#111] border border-[#222] rounded-xl hover:border-blue-500/50 transition-all text-xs text-zinc-400 hover:text-blue-400"
                    >
                      "Real-time Chat UI..."
                    </button>
                  </div>
               </div>
             </div>
           )}

           {/* Loading Overlay */}
           {loading && (
             <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full pulse-loading flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-8 text-center">
                  <p className="text-sm font-medium text-white tracking-widest uppercase mb-1">Architecting</p>
                  <p className="text-xs text-zinc-500">Pulse is compiling multi-file structure...</p>
                </div>
             </div>
           )}
        </div>

        {/* Command Center */}
        <CommandCenter onSend={handleCommand} isLoading={loading} />
      </main>
      
      {/* Right Toolbar */}
      <div className="w-12 bg-[#0d0d0d] border-l border-[#222] flex flex-col items-center py-4 gap-6">
        <button className="text-zinc-600 hover:text-blue-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button className="text-zinc-600 hover:text-blue-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.727 2.903a2 2 0 01-1.394 1.432 1.5 1.5 0 01-1.287-.197l-2.458-1.745a2 2 0 00-2.433-.11l-2.094 1.496a2 2 0 01-1.637.288l-2.735-.912a2 2 0 01-1.332-1.314l-.865-2.595a2 2 0 00-1.258-1.258l-2.595-.865a2 2 0 01-1.314-1.332l-.912-2.735a2 2 0 01.288-1.637l1.496-2.094a2 2 0 00-.11-2.433L4.47 3.32a1.5 1.5 0 01-.197-1.287 2 2 0 011.432-1.394l2.903-.727a2 2 0 001.414-1.96l.477-2.387a2 2 0 00-.547-1.022L7.143-.857a2 2 0 01-1.022.547l-2.387.477a2 2 0 00-1.96-1.414l-.727-2.903a2 2 0 011.394-1.432 1.5 1.5 0 011.287.197l2.458 1.745a2 2 0 002.433.11l2.094-1.496a2 2 0 011.637-.288l2.735.912a2 2 0 011.332 1.314l.865 2.595a2 2 0 001.258 1.258l2.595.865a2 2 0 011.314 1.332l.912 2.735a2 2 0 01-.288 1.637l-1.496 2.094a2 2 0 00.11 2.433l1.745 2.458a1.5 1.5 0 01.197 1.287 2 2 0 01-1.432 1.394l-2.903.727a2 2 0 00-1.414 1.96l-.477 2.387a2 2 0 00.547 1.022l.857.857z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default App;
