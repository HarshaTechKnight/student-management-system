'use server';
/**
 * @fileOverview Predicts the risk of student dropout using factors like attendance, grades, and engagement metrics.
 *
 * - predictDropoutRisk - A function that handles the dropout risk prediction process.
 * - DropoutRiskInput - The input type for the predictDropoutRisk function.
 * - DropoutRiskOutput - The return type for the predictDropoutRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DropoutRiskInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  attendanceRate: z.number().describe('The student attendance rate as a decimal (e.g., 0.85 for 85%).'),
  feePaymentDelay: z
    .number()
    .describe('The number of days the student is delayed in fee payment. Use 0 if fees are current.'),
  grades: z.record(z.string(), z.number()).describe('A record of course names and corresponding grade percentages.'),
});
export type DropoutRiskInput = z.infer<typeof DropoutRiskInputSchema>;

const DropoutRiskOutputSchema = z.object({
  dropoutRiskScore: z.number().describe('The predicted dropout risk score as a percentage (0-100).'),
  reasonCodes: z
    .array(z.string())
    .describe('An array of codes indicating the reasons for the dropout risk (e.g., ["low_attendance", "poor_grades"]).'),
  suggestions: z.string().describe('Suggestions for intervention to mitigate the dropout risk.'),
});
export type DropoutRiskOutput = z.infer<typeof DropoutRiskOutputSchema>;

export async function predictDropoutRisk(input: DropoutRiskInput): Promise<DropoutRiskOutput> {
  return predictDropoutRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dropoutRiskPrompt',
  input: {schema: DropoutRiskInputSchema},
  output: {schema: DropoutRiskOutputSchema},
  prompt: `You are an AI assistant designed to predict student dropout risk and provide intervention suggestions.

  Analyze the following student data to determine the likelihood of dropout and suggest appropriate actions:

  Student ID: {{{studentId}}}
  Attendance Rate: {{{attendanceRate}}}
  Fee Payment Delay: {{{feePaymentDelay}}} days
  Grades: {{#each grades}}{{{@key}}}: {{{this}}}%, {{/each}}

  Based on this information, provide a dropout risk score (0-100), list the primary reasons for the risk, and suggest specific interventions to improve the student's situation.

  Format your output as a JSON object with the following keys:
  - dropoutRiskScore: The predicted dropout risk score as a percentage.
  - reasonCodes: An array of codes indicating the reasons for the dropout risk (e.g., ["low_attendance", "poor_grades"]).
  - suggestions: Suggestions for intervention to mitigate the dropout risk.
  `,
});

const predictDropoutRiskFlow = ai.defineFlow(
  {
    name: 'predictDropoutRiskFlow',
    inputSchema: DropoutRiskInputSchema,
    outputSchema: DropoutRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
