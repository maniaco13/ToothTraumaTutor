export enum RemedyType {
  NONE = "None",
  HYDROGEN_PEROXIDE = "Hydrogen Peroxide",
  RUBBING_ALCOHOL = "Rubbing Alcohol",
  ORAJEL = "Orajel (Benzocaine)",
  VINEGAR = "Vinegar",
  SALT_WATER = "Warm Salt Water",
  TOOTHPASTE = "Toothpaste",
  MOUTHWASH = "Mouthwash (Alcohol-based)",
  BAKING_SODA = "Baking Soda Paste"
}

export type ToothCondition = 'BROKEN' | 'CAVITY';

export interface ToothState {
  painLevel: number; // 0-10
  mood: 'neutral' | 'agony' | 'relief' | 'shock' | 'numb';
  animation: 'idle' | 'shake' | 'throb' | 'float' | 'shiver' | 'sway' | 'jolt';
  visualEffect: 'none' | 'bubbles' | 'sparkles' | 'acid-fumes' | 'electric' | 'sweat';
}

export interface ReactionResponse {
  painLevel: number;
  sensationDescription: string;
  scientificEffect: string;
  verdict: "Safe" | "Unsafe" | "Use with Caution" | "Highly Recommended";
  mood: 'neutral' | 'agony' | 'relief' | 'shock' | 'numb';
}