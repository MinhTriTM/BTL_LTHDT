'use server';
/**
 * @fileOverview An AI-powered GPA calculation assistant.
 *
 * - suggestGpaRange - A function that suggests appropriate GPA ranges based on entered grades.
 * - GpaCalculationAssistantInput - The input type for the suggestGpaRange function.
 * - GpaCalculationAssistantOutput - The return type for the suggestGpaRange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GpaCalculationAssistantInputSchema = z.object({
  grades: z
    .string()
    .describe("The student's grades, separated by commas.  For example: A, B+, C, A-"),
});
export type GpaCalculationAssistantInput = z.infer<typeof GpaCalculationAssistantInputSchema>;

const GpaCalculationAssistantOutputSchema = z.object({
  suggestedGpaRange: z.string().describe('The suggested GPA range based on the grades entered.'),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested GPA range, especially for borderline cases.'
    ),
});
export type GpaCalculationAssistantOutput = z.infer<typeof GpaCalculationAssistantOutputSchema>;


const gpaCache = new Map<string, Promise<GpaCalculationAssistantOutput>>();

export async function suggestGpaRange(input: GpaCalculationAssistantInput): Promise<GpaCalculationAssistantOutput> {
  const key = input.grades;
  if (gpaCache.has(key)) {
    return gpaCache.get(key)!;
  }
  const promise = gpaCalculationAssistantFlow(input);
  gpaCache.set(key, promise);

  try {
    await promise;
  } catch (e) {
    gpaCache.delete(key);
    throw e;
  }
  return promise;
}


const gpaCalculationAssistantPrompt = ai.definePrompt({
  name: 'gpaCalculationAssistantPrompt',
  input: {schema: GpaCalculationAssistantInputSchema},
  output: {schema: GpaCalculationAssistantOutputSchema},
  prompt: `You are an AI-powered GPA calculation assistant that suggests appropriate GPA ranges based on entered grades and provides reasoning for borderline cases.

  Based on the following grades: {{{grades}}}

  Suggest a GPA range and provide reasoning for your suggestion.
  GPA Range:
  Reasoning: `,
});

const gpaCalculationAssistantFlow = ai.defineFlow(
  {
    name: 'gpaCalculationAssistantFlow',
    inputSchema: GpaCalculationAssistantInputSchema,
    outputSchema: GpaCalculationAssistantOutputSchema,
  },
  async input => {
    const {output} = await gpaCalculationAssistantPrompt(input);
    return output!;
  }
);
