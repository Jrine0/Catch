import { GoogleGenAI } from "@google/genai";
import { Bounty } from "../types";

// User provided API Key
const API_KEY = "";

// Helper to convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64 = result.split(',')[1]; 
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

const validateSingleFile = async (file: File, bounty: Bounty, ai: GoogleGenAI) => {
    const isImage = file.type.startsWith('image/');
    
    try {
        let response;
        // Using 'gemini-2.5-flash-latest' as a robust fallback, or 'gemini-3-flash-preview'
        // We remove strict JSON config to avoid "JSON mode not enabled" errors
        const model = 'gemini-3-flash-preview'; 

        if (isImage) {
            const base64Data = await fileToBase64(file);
            const prompt = `
                Bounty Context: "${bounty.title} - ${bounty.description}"
                Tags: ${bounty.tags.join(', ')}
                
                Task: Does this image strictly match the bounty requirements?
                Return ONLY a JSON object with this structure (no markdown): 
                { "isValid": boolean, "score": number, "feedback": "string" }
            `;

            response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { inlineData: { mimeType: file.type, data: base64Data } },
                        { text: prompt }
                    ]
                }
                // Config removed to prevent 400 errors
            });
        } else {
            const textContent = await file.text();
            const prompt = `
                Bounty Context: "${bounty.title} - ${bounty.description}"
                Tags: ${bounty.tags.join(', ')}

                Task: Does this text strictly match the bounty requirements?
                Content Snippet: ${textContent.substring(0, 500)}...
                Return ONLY a JSON object with this structure (no markdown): 
                { "isValid": boolean, "score": number, "feedback": "string" }
            `;

            response = await ai.models.generateContent({
                model: model,
                contents: prompt
                // Config removed to prevent 400 errors
            });
        }

        let text = response.text || '{}';
        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Find the JSON object in the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            text = jsonMatch[0];
        }

        return JSON.parse(text);

    } catch (e) {
        console.error("Gemini Error", e);
        return { isValid: false, score: 0, feedback: "AI Error: " + (e instanceof Error ? e.message : String(e)) };
    }
};

// New function to handle the "3 Random Samples" logic
export const validateBatchWithGemini = async (
  files: File[],
  bounty: Bounty
): Promise<{ passed: boolean; avgScore: number; feedback: string }> => {
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // 1. Pick 3 random indices (or fewer if < 3 files)
  const sampleCount = Math.min(files.length, 3);
  const indices = new Set<number>();
  
  if (files.length <= 3) {
      for(let i=0; i<files.length; i++) indices.add(i);
  } else {
      while(indices.size < sampleCount) {
          indices.add(Math.floor(Math.random() * files.length));
      }
  }

  const selectedFiles = Array.from(indices).map(i => files[i]);
  console.log(`Analyzing ${selectedFiles.length} random samples from batch of ${files.length}...`);

  // 2. Validate selected files
  let totalScore = 0;
  let passCount = 0;
  let combinedFeedback: string[] = [];

  for (const file of selectedFiles) {
      const result = await validateSingleFile(file, bounty, ai);
      totalScore += (result.score || 0);
      if (result.isValid) passCount++;
      combinedFeedback.push(`File ${file.name}: ${result.feedback}`);
  }

  const avgScore = sampleCount > 0 ? totalScore / sampleCount : 0;
  // Criteria: If majority pass (2 out of 3, or 1 out of 1)
  const passed = passCount >= Math.ceil(sampleCount / 2);

  return {
      passed,
      avgScore: Math.round(avgScore),
      feedback: passed 
        ? "Batch Sample Check Passed. " + combinedFeedback[0]
        : "Batch Sample Check Failed. " + combinedFeedback.join(' | ')
  };
};

export const validateSubmissionWithAI = async (file: File, bounty: Bounty) => {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    return validateSingleFile(file, bounty, ai);
};
