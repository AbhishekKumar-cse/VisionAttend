'use server';
/**
 * @fileOverview An AI agent that analyzes attendance data to generate summaries and identify patterns.
 *
 * - generateAttendanceInsights - A function that handles the attendance insights generation process.
 * - GenerateAttendanceInsightsInput - The input type for the generateAttendanceInsights function.
 * - GenerateAttendanceInsightsOutput - The return type for the generateAttendanceInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Input schema for the public facing function and the flow
const GenerateAttendanceInsightsInputSchema = z.object({
  attendanceData: z.array(
    z.object({
      userId: z.string().describe('ID of the user.'),
      userName: z.string().describe('Name of the user.'),
      timestamp: z.string().datetime().describe('ISO string of the attendance timestamp.'),
      status: z.enum(['Present', 'Late', 'Absent']).describe('Attendance status (e.g., Present, Late, Absent).'),
      groupName: z.string().optional().describe('Optional group or department name for the user (e.g., "Science Department", "Morning Shift").'),
    })
  ).describe('Array of raw attendance records.'),
});
export type GenerateAttendanceInsightsInput = z.infer<typeof GenerateAttendanceInsightsInputSchema>;

const GenerateAttendanceInsightsOutputSchema = z.object({
  overallSummary: z.string().describe('A concise overall summary of the attendance data, highlighting key statistics like total attendance, average punctuality, and absentee rates.'),
  identifiedTrends: z.array(z.string()).describe('A list of significant attendance trends observed, such as "consistent late arrivals for a specific group" or "increased absenteeism on certain days of the week."'),
  unusualPatterns: z.array(
    z.object({
      patternDescription: z.string().describe('A detailed description of the unusual pattern detected.'),
      affectedEntities: z.array(z.string()).describe('A list of specific user IDs or group names affected by this unusual pattern.'),
      suggestedActions: z.string().describe('Actionable recommendations or interventions to address the identified unusual pattern.'),
    })
  ).describe('A list of unusual attendance patterns detected, along with affected entities and suggested actions.'),
});
export type GenerateAttendanceInsightsOutput = z.infer<typeof GenerateAttendanceInsightsOutputSchema>;

// Prompt input schema: expects the attendance data as a JSON string
const PromptInputSchema = z.object({
    attendanceDataJson: z.string().describe('JSON string of raw attendance records.'),
});

const generateAttendanceInsightsPrompt = ai.definePrompt({
  name: 'generateAttendanceInsightsPrompt',
  input: { schema: PromptInputSchema }, // Use the specific schema for the prompt's input
  output: { schema: GenerateAttendanceInsightsOutputSchema },
  template: `You are an expert attendance analyst. Your task is to analyze the provided attendance data and generate concise summaries, identify significant trends, and detect unusual patterns. For any unusual patterns, suggest actionable recommendations.

Here is the raw attendance data in JSON format:
{{{attendanceDataJson}}}

Please provide your analysis in the following JSON format:
{{output.schema}}`,
});

const generateAttendanceInsightsFlow = ai.defineFlow(
  {
    name: 'generateAttendanceInsightsFlow',
    inputSchema: GenerateAttendanceInsightsInputSchema,
    outputSchema: GenerateAttendanceInsightsOutputSchema,
  },
  async (input) => {
    // Stringify the attendance data to pass it as a single string to the prompt.
    const attendanceDataJson = JSON.stringify(input.attendanceData, null, 2); // Pretty print for readability by LLM

    const { output } = await generateAttendanceInsightsPrompt({
      attendanceDataJson: attendanceDataJson,
    });
    return output!;
  }
);

export async function generateAttendanceInsights(
  input: GenerateAttendanceInsightsInput
): Promise<GenerateAttendanceInsightsOutput> {
  return generateAttendanceInsightsFlow(input);
}
