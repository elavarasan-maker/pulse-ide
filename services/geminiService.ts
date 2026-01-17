
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateProject = async (prompt: string): Promise<ProjectState> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are Pulse IDE, the world's fastest code architect. 
    Build a complete, functional project based on this request: "${prompt}".
    Ensure high-quality, modern code patterns. Provide all necessary files.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the project" },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING, description: "Full file path including folders" },
                content: { type: Type.STRING, description: "Full source code of the file" },
                language: { type: Type.STRING, description: "Programming language for highlighting" }
              },
              required: ["path", "content", "language"]
            }
          }
        },
        required: ["title", "files"]
      },
      thinkingConfig: { thinkingBudget: 4000 }
    }
  });

  const rawJson = response.text;
  if (!rawJson) throw new Error("No response from AI");
  
  const parsed = JSON.parse(rawJson);
  return {
    title: parsed.title,
    files: parsed.files,
    selectedFilePath: parsed.files[0]?.path || null
  };
};

export const refineCode = async (currentFiles: any[], instructions: string): Promise<ProjectState> => {
    // Similar logic but with context of existing files
    const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Context: ${JSON.stringify(currentFiles)}. 
    Modification Instructions: "${instructions}".
    Update the files and return the complete updated project structure.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING },
                content: { type: Type.STRING },
                language: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  const parsed = JSON.parse(response.text);
  return {
    title: parsed.title,
    files: parsed.files,
    selectedFilePath: parsed.files[0]?.path || null
  };
}
