'use server';
/**
 * @fileOverview A Genkit flow for AI-powered attendance marking using face recognition.
 *
 * - markAttendanceWithFaceRecognition - A function that handles the AI-powered attendance marking process.
 * - AIPoweredAttendanceMarkingInput - The input type for the markAttendanceWithFaceRecognition function.
 * - AIPoweredAttendanceMarkingOutput - The return type for the markAttendanceWithFaceRecognition function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the attendance marking flow.
const AIPoweredAttendanceMarkingInputSchema = z.object({
  facialImageDataUri: z
    .string()
    .describe(
      "A photo of the user's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  context: z.string().optional().describe('Additional context for the recognition, e.g., location, time, or event.'),
});
export type AIPoweredAttendanceMarkingInput = z.infer<typeof AIPoweredAttendanceMarkingInputSchema>;

// Define the output schema for the attendance marking flow.
const AIPoweredAttendanceMarkingOutputSchema = z.object({
  isRecognized: z.boolean().describe('True if a face was successfully recognized and matched, false otherwise.'),
  userId: z.string().optional().describe('The ID of the recognized user, if available.'),
  userName: z.string().optional().describe('The name of the recognized user, if available.'),
  confidence: z.number().optional().describe('A confidence score (0-1) for the recognition, if available.'),
  message: z.string().describe('A descriptive message about the attendance marking attempt.'),
});
export type AIPoweredAttendanceMarkingOutput = z.infer<typeof AIPoweredAttendanceMarkingOutputSchema>;

// Define the Genkit prompt for face recognition.
const recognizeFacePrompt = ai.definePrompt({
  name: 'recognizeFacePrompt',
  input: { schema: AIPoweredAttendanceMarkingInputSchema },
  output: { schema: AIPoweredAttendanceMarkingOutputSchema },
  prompt: `You are an AI-powered facial recognition system for an attendance system.\nYour task is to analyze the provided facial image and determine if it matches a known user profile.\nBased on the image, decide if a user is recognized. If recognized, provide a plausible user ID and name, and a confidence score between 0.7 and 1.0. If not recognized or if no face is detected, set 'isRecognized' to false and provide a relevant message.\n\nConsider the following additional context: {{{context}}}\n\nFacial Image: {{media url=facialImageDataUri}}\n\nOutput your response in JSON format according to the provided schema.`,
});

// Define the Genkit flow for AI-powered attendance marking.
const aiPoweredAttendanceMarkingFlow = ai.defineFlow(
  {
    name: 'aiPoweredAttendanceMarkingFlow',
    inputSchema: AIPoweredAttendanceMarkingInputSchema,
    outputSchema: AIPoweredAttendanceMarkingOutputSchema,
  },
  async (input) => {
    const { output } = await recognizeFacePrompt(input);
    if (!output) {
        throw new Error("AI recognition failed to produce an output.");
    }
    return output;
  }
);

// Export a wrapper function to call the flow.
export async function markAttendanceWithFaceRecognition(
  input: AIPoweredAttendanceMarkingInput
): Promise<AIPoweredAttendanceMarkingOutput> {
  return aiPoweredAttendanceMarkingFlow(input);
}
