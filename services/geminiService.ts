import { GoogleGenAI, Type, Schema, FunctionDeclaration } from "@google/genai";
import { VocabLevel, WordItem } from "../types";

// Helper to check and prompt for API key if needed (for paid features)
const ensureApiKey = async () => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }
};

// 1. Generate Vocabulary
export const generateVocabulary = async (level: VocabLevel): Promise<WordItem[]> => {
  // Use standard environment key for basic text generation if available
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Generate 5 advanced English vocabulary words specifically for the ${level} exam. 
  For each word, provide:
  1. The word itself.
  2. IPA pronunciation.
  3. A clear English definition.
  4. A concise Chinese definition.
  5. A sample sentence.
  6. 2 synonyms.
  Ensure the words are challenging but relevant to the exam level.`;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING },
        pronunciation: { type: Type.STRING, description: "IPA pronunciation guide" },
        definition_en: { type: Type.STRING },
        definition_cn: { type: Type.STRING },
        example: { type: Type.STRING },
        synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["word", "definition_en", "definition_cn", "example", "synonyms"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are an expert English tutor for Chinese students.",
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as WordItem[];
  } catch (error) {
    console.error("Error generating vocabulary:", error);
    throw error;
  }
};

// 2. Generate Image (Pro Model)
export const generateImagePro = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  await ensureApiKey(); // Force key selection for high-end models
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1", // Default square for word cards
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

// 3. Generate Video (Veo)
export const generateVideoVeo = async (
  prompt: string | undefined,
  imageBase64: string | null,
  aspectRatio: '16:9' | '9:16'
): Promise<string> => {
  await ensureApiKey(); // Force key selection for Veo
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine contents based on inputs
  // Veo supports: Text only, Image only, or Text + Image
  
  try {
    let operation;
    const config = {
        numberOfVideos: 1,
        resolution: '720p', // Safe default
        aspectRatio: aspectRatio
    };

    if (imageBase64) {
         // Clean base64 string if it has prefix
         const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
         
         operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || "Animate this image cinematographically",
            image: {
                imageBytes: cleanBase64,
                mimeType: 'image/png', // Assuming PNG for simplicity
            },
            config: config
         });
    } else {
        if (!prompt) throw new Error("Prompt is required if no image is provided.");
        operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: config
        });
    }

    // Polling
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) throw new Error("Video generation failed or no URI returned.");

    // Fetch the actual video bytes with the API key
    const videoResponse = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) throw new Error("Failed to download generated video.");
    
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Error generating video:", error);
    throw error;
  }
};