
import { GoogleGenAI, Type } from "@google/genai";

// Guideline: Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSubjectSuggestions = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 catchy, professional email subject lines based on this content: "${content}". Return only the subject lines in a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Guideline: Use the .text property (not a method) directly.
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.warn("AI Service unavailable, using fallbacks:", error);
    return ["Newsletter Update", "Special Offer", "Welcome to OmniSend", "Greetings", "Important News"];
  }
};

export const checkSpamScore = async (subject: string, body: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this email for spam likelihood. Subject: ${subject}. Body: ${body}. Return a JSON object with 'score' (0-100, where 100 is definite spam) and 'reasons' (array of strings).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["score", "reasons"]
        }
      }
    });
    // Guideline: Use the .text property (not a method) directly.
    return JSON.parse(response.text || '{"score": 0, "reasons": []}');
  } catch (error) {
    console.error("Spam Analysis Error:", error);
    return { score: 0, reasons: ["Analysis currently unavailable"] };
  }
};

export const rewriteEmail = async (content: string, tone: 'professional' | 'casual' | 'urgent') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Rewrite the following email content in a ${tone} tone: "${content}". Keep it concise and impactful.`
    });
    // Guideline: Use the .text property (not a method) directly.
    return response.text || content;
  } catch (error) {
    return content;
  }
};
