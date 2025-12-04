'use server';

import {
  suggestGpaRange,
  type GpaCalculationAssistantInput,
  type GpaCalculationAssistantOutput,
} from '@/ai/flows/gpa-calculation-assistant';

type ActionResult<T> = {
  output: T | null;
  error: { message: string } | null;
};

export async function getGpaSuggestion(
  input: GpaCalculationAssistantInput
): Promise<ActionResult<GpaCalculationAssistantOutput>> {
  try {
    const result = await suggestGpaRange(input);
    return { output: result, error: null };
  } catch (e) {
    const error = e instanceof Error ? e : new Error('An unknown error occurred.');
    console.error('Error in getGpaSuggestion:', error);
    return { output: null, error: { message: error.message } };
  }
}
