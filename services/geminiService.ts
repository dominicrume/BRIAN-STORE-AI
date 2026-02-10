import { GoogleGenAI } from "@google/genai";
import { Product, StaffMetric } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMarketingMessage = async (product: Product): Promise<string> => {
  if (!apiKey) return "Brian Store AI Key missing. Please configure.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are Brian Store AI, an intelligent retail operating system for an African business owner. 
      The product "${product.name}" is moving slowly and we have ${product.stock} units left. 
      Write a short, punchy WhatsApp promotional message (max 2 sentences) to customers offering a discount to clear stock. 
      Use local, friendly, business-casual tone. Sign off as 'Brian'.`,
    });
    return response.text || "Could not generate message.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating marketing copy.";
  }
};

export const analyzeStoreHealth = async (products: Product[], staff: StaffMetric[]): Promise<string> => {
  if (!apiKey) return "Brian AI Analytics unavailable.";

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

    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not analyze store data at this time.";
  }
};