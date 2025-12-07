import { GoogleGenAI, Type, Schema } from "@google/genai";
import { RemedyType, ReactionResponse, ToothCondition } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    painLevel: {
      type: Type.INTEGER,
      description: "Estimated pain level on a scale of 1-10 immediately after application.",
    },
    sensationDescription: {
      type: Type.STRING,
      description: "A vivid description of what the tooth 'feels' (e.g., burning, soothing cooling, stinging).",
    },
    scientificEffect: {
      type: Type.STRING,
      description: "A concise scientific explanation of the chemical interaction with the exposed nerve or decayed tissue.",
    },
    verdict: {
      type: Type.STRING,
      enum: ["Safe", "Unsafe", "Use with Caution", "Highly Recommended"],
      description: "The safety verdict for using this substance on the specific tooth condition.",
    },
    mood: {
        type: Type.STRING,
        enum: ['neutral', 'agony', 'relief', 'shock', 'numb'],
        description: "The emotional state of the tooth character."
    }
  },
  required: ["painLevel", "sensationDescription", "scientificEffect", "verdict", "mood"],
};

export const getRemedyReaction = async (remedy: string, condition: ToothCondition): Promise<ReactionResponse> => {
  const conditionDescription = condition === 'BROKEN' 
    ? 'hurt broken tooth with fully exposed raw nerve endings (pulp exposure)' 
    : 'tooth with a deep, decay-ridden cavity (caries) affecting the dentin and irritating the pulp';

  if (remedy === RemedyType.NONE) {
    return {
      painLevel: condition === 'BROKEN' ? 5 : 3,
      sensationDescription: condition === 'BROKEN' 
        ? "A sharp, shooting pain with every breath of air." 
        : "A dull, persistent ache deep inside the tooth.",
      scientificEffect: condition === 'BROKEN'
        ? "The exposed pulp is directly vulnerable to air, temperature, and pressure."
        : "Bacteria in the cavity are irritating the pulp, causing inflammation (pulpitis).",
      verdict: "Use with Caution",
      mood: 'neutral'
    };
  }

  const prompt = `
    I have a character that is a "${conditionDescription}".
    A user just applied the substance "${remedy}" directly to the affected area.
    
    Explain the reaction specifically for a ${condition} tooth.
    
    Key Context:
    - A Broken Tooth has raw nerve exposure. Reactions are immediate, violent, and often more painful.
    - A Cavity has decayed tissue covering the nerve but is porous. Reactions might be slower, duller, or trapped inside the hole.
    - If the substance ("${remedy}") is a known remedy (like Hydrogen Peroxide, Clove Oil, etc.), treat it medically/chemically.
    - If the substance is a custom input (e.g. "Lemon Juice", "Hot Sauce", "Ice Cream", "A Rock"), analyze its physical and chemical properties (pH, temperature, texture) and how they would interact with raw nerves or dentin.
    
    Standard interactions reference (for known items):
    - Hydrogen Peroxide creates bubbles.
    - Rubbing Alcohol causes extreme dehydration and burning.
    - Vinegar is acidic.
    - Orajel numbs.
    - Salt water is soothing.
    
    Provide the output in JSON format specifically for an educational app.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    return JSON.parse(text) as ReactionResponse;
  } catch (error) {
    console.error("Error fetching remedy reaction:", error);
    return {
      painLevel: 5,
      sensationDescription: `The tooth is unsure how to react to ${remedy}.`,
      scientificEffect: "Data unavailable for this substance.",
      verdict: "Use with Caution",
      mood: 'neutral'
    };
  }
};