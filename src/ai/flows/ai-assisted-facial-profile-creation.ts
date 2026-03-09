'use server';
/**
 * @fileOverview Provides AI-assisted guidance for capturing optimal facial data for user enrollment.
 *
 * - aiAssistedFacialProfileCreation - A function that analyzes facial image data and provides feedback for optimal capture.
 * - AIAssistedFacialProfileCreationInput - The input type for the aiAssistedFacialProfileCreation function.
 * - AIAssistedFacialProfileCreationOutput - The return type for the aiAssistedFacialProfileCreation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AIAssistedFacialProfileCreationInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A facial image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AIAssistedFacialProfileCreationInput = z.infer<typeof AIAssistedFacialProfileCreationInputSchema>;

const AIAssistedFacialProfileCreationOutputSchema = z.object({
  feedback: z
    .string()
    .describe(
      'Comprehensive AI feedback on the submitted facial image, including suggestions for improvement.'
    ),
  isOptimal: z
    .boolean()
    .describe('Indicates whether the captured facial image is considered optimal for facial recognition.'),
  issues: z
    .array(z.string())
    .describe(
      'A list of specific issues identified in the facial image (e.g., "Poor lighting", "Bad angle", "Blurry").'
    ),
});
export type AIAssistedFacialProfileCreationOutput = z.infer<typeof AIAssistedFacialProfileCreationOutputSchema>;

export async function aiAssistedFacialProfileCreation(
  input: AIAssistedFacialProfileCreationInput
): Promise<AIAssistedFacialProfileCreationOutput> {
  return aiAssistedFacialProfileCreationFlow(input);
}

const aiAssistedFacialProfileCreationPrompt = ai.definePrompt({
  name: 'aiAssistedFacialProfileCreationPrompt',
  input: { schema: AIAssistedFacialProfileCreationInputSchema },
  output: { schema: AIAssistedFacialProfileCreationOutputSchema },
  prompt: `You are an expert in facial recognition data capture. Your goal is to analyze a provided facial image and give constructive feedback to an administrator to help them capture optimal facial data for user enrollment. This ensures maximum accuracy for facial recognition.

Analyze the following image for:
- **Lighting:** Is it too dark, too bright, or are there harsh shadows?
- **Angle:** Is the face centered, straight, and facing forward? Are there any obstructions?
- **Image Quality:** Is the image clear, in focus, and of sufficient resolution? Is it blurry or pixelated?

Based on your analysis, determine if the image is optimal for facial recognition enrollment and list any specific issues. Provide detailed, actionable feedback.

Example Output (if not optimal):
{{"feedback": "The lighting is too harsh, causing strong shadows on one side of the face. Please ensure even lighting. The angle is slightly off-center; try to position the user directly facing the camera. The image resolution is good.", "isOptimal": false, "issues": ["Harsh lighting", "Off-center angle"]}}

Example Output (if optimal):
{{"feedback": "This image has optimal lighting, a perfect angle, and excellent clarity. It is ideal for facial recognition enrollment.", "isOptimal": true, "issues": []}}

Facial Image to analyze: {{media url=imageDataUri}}`,
});

const aiAssistedFacialProfileCreationFlow = ai.defineFlow(
  {
    name: 'aiAssistedFacialProfileCreationFlow',
    inputSchema: AIAssistedFacialProfileCreationInputSchema,
    outputSchema: AIAssistedFacialProfileCreationOutputSchema,
  },
  async (input) => {
    const { output } = await aiAssistedFacialProfileCreationPrompt(input);
    if (!output) {
      throw new Error('AI model did not return a valid output for facial profile creation.');
    }
    return output;
  }
);
