export type UserInputs = {
  name?: string;
  age: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  goal: string;
  level: string;
  location: string;
  diet: string;
  notes?: string;
};

export const systemPreamble = `You are a certified fitness coach and nutritionist.
Return STRICT JSON only. No markdown. No explanation. No comments.
JSON FORMAT:
{
  "days": [
    {
      "day": 1,
      "workout": [
        { "name": "", "sets": 0, "reps": 0, "rest_seconds": 0 }
      ],
      "diet": [
        { "name": "", "calories": 0, "protein_g": 0, "carbs_g": 0, "fats_g": 0 }
      ]
    }
  ],
  "tips": [],
  "motivation": ""
}
RULES:
- exactly 7 day entries inside "days"
- only valid JSON
- arrays cannot be empty (must have minimum 1 element)
- no text outside JSON`;

export function buildUserPrompt(u: UserInputs) {
  return `User profile:\n${JSON.stringify(u, null, 2)}\n\nGenerate a 7 day plan. Keep JSON under 30k chars.`;
}
