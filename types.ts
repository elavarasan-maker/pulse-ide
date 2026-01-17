
export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface ProjectState {
  title: string;
  files: ProjectFile[];
  selectedFilePath: string | null;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
