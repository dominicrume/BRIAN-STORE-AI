import { GoogleGenAI } from "@google/genai";
import { Product, StaffMetric } from "../types";

const apiKey = process.env.API_KEY || '';
// Initialize conditionally to prevent crashes if env is missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateMarketingMessage = async (product: Product): Promise<string> => {
  if (!ai) return "Brian Store AI Config Missing. Please add API_KEY.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Brian Store AI, an intelligent retail operating system. 
      The product "${product.name}" is moving slowly and we have ${product.stock} units left. 
      Write a short, punchy WhatsApp promotional message (max 2 sentences) to customers offering a discount to clear stock. 
      Use local, friendly, business-casual tone. Sign off as 'Brian'.`,
    });
    return response.text || "Could not generate message.";
  } catch (error) {
    console.warn("Brian AI Error (Marketing):", error);
    // Graceful fallback for offline/error
    return `Special Offer! ${product.name} is now available. Grab yours before stocks run out! - Brian`;
  }
};

export const analyzeStoreHealth = async (products: Product[], staff: StaffMetric[]): Promise<string> => {
  if (!ai) return "Brian AI is in offline mode. Sync to get insights.";

  try {
    const lowStock = products.filter(p => p.stock < p.minStock).map(p => p.name).join(", ");
    const riskyStaff = staff.filter(s => s.riskScore > 50).map(s => s.name).join(", ");

    const prompt = `
      You are Brian Store AI, the owner's remote eyes and ears.
      Here is the current snapshot of the store:
      - Low Stock Items: ${lowStock || "None"}
      - High Risk Staff Members: ${riskyStaff || "None"}
      
      Provide a 3-bullet point executive summary for the "Chief" (the owner). 
      Focus on immediate actions to prevent revenue loss (Theft, Stockouts, Cash leaks). 
      Be direct, protective, and authoritative but helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Systems Normal. No anomalies detected.";
  } catch (error) {
    console.warn("Brian AI Error (Health):", error);
    return "Brian AI is unable to connect to the cloud. \n• Monitor cash register manually.\n• Check physical stock for high-value items.\n• Internet connection required for deep analysis.";
  }
};