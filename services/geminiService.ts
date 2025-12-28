import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    transcript: {
      type: Type.ARRAY,
      description: "A diarized transcript of the conversation.",
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: {
            type: Type.STRING,
            description: "Identify as 'Salesperson' or 'Prospect' if possible, otherwise 'Speaker A'/'Speaker B'.",
          },
          timestamp: {
            type: Type.STRING,
            description: "Time formatted as MM:SS",
          },
          text: {
            type: Type.STRING,
            description: "The spoken content.",
          },
        },
        required: ["speaker", "timestamp", "text"],
      },
    },
    sentiment_curve: {
      type: Type.ARRAY,
      description: "Data points representing the engagement/sentiment level throughout the call.",
      items: {
        type: Type.OBJECT,
        properties: {
          time_seconds: {
            type: Type.NUMBER,
            description: "The time in seconds from the start.",
          },
          label: {
            type: Type.STRING,
            description: "Time formatted as MM:SS",
          },
          score: {
            type: Type.NUMBER,
            description: "Sentiment score from 0 (negative/disengaged) to 100 (positive/highly engaged).",
          },
        },
        required: ["time_seconds", "label", "score"],
      },
    },
    coaching: {
      type: Type.OBJECT,
      properties: {
        positives: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 specific things the salesperson did well.",
        },
        improvements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 specific missed opportunities or areas for improvement.",
        },
        summary: {
          type: Type.STRING,
          description: "A brief executive summary of the call outcome.",
        },
      },
      required: ["positives", "improvements", "summary"],
    },
  },
  required: ["transcript", "sentiment_curve", "coaching"],
};

export const analyzeAudio = async (base64Audio: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: `Analyze this sales call audio file. 
            1. Generate a diarized transcript distinguishing between the Salesperson and the Prospect.
            2. Analyze the sentiment and engagement level throughout the call to create a data curve. Provide data points roughly every 10-15 seconds or at key turns.
            3. Create a coaching card with 3 key strengths and 3 missed opportunities/weaknesses.
            
            Return the result strictly as JSON matching the provided schema.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};