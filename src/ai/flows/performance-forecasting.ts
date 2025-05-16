'use server';
/**
 * @fileOverview Predicts student performance trends based on historical data.
 *
 * - forecastPerformance - A function that forecasts student performance.
 * - ForecastPerformanceInput - The input type for the forecastPerformance function.
 * - ForecastPerformanceOutput - The return type for the forecastPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastPerformanceInputSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student.'),
  historicalGrades: z
    .array(z.object({
      course: z.string().describe('The name of the course.'),
      grade: z.number().describe('The grade obtained in the course (0-100).'),
    }))
    .describe('An array of historical grades for the student.'),
  attendanceRate: z.number().describe('The student attendance rate (0-100).'),
  courseDifficulty: z.string().describe('The perceived difficulty level of the courses.'),
});
export type ForecastPerformanceInput = z.infer<typeof ForecastPerformanceInputSchema>;

const ForecastPerformanceOutputSchema = z.object({
  projectedGrades: z
    .array(z.object({
      course: z.string().describe('The name of the course.'),
      projectedGrade: z.number().describe('The projected grade in the course (0-100).'),
    }))
    .describe('An array of projected grades for each course.'),
  dropoutRiskScore: z.number().describe('The predicted dropout risk score (0-100).'),
  recommendations: z.string().describe('Recommendations for improving student performance.'),
});
export type ForecastPerformanceOutput = z.infer<typeof ForecastPerformanceOutputSchema>;

export async function forecastPerformance(input: ForecastPerformanceInput): Promise<ForecastPerformanceOutput> {
  return forecastPerformanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'performanceForecastPrompt',
  input: {schema: ForecastPerformanceInputSchema},
  output: {schema: ForecastPerformanceOutputSchema},
  prompt: `You are an AI assistant that forecasts student performance based on historical data.

  Given the following information about a student, predict their performance and provide recommendations:

  Student ID: {{{studentId}}}
  Historical Grades: {{#each historicalGrades}}{{{course}}}: {{{grade}}}% {{/each}}
  Attendance Rate: {{{attendanceRate}}}%
  Course Difficulty: {{{courseDifficulty}}}

  Consider these factors when forecasting performance and determining dropout risk.

  Output the projected grades for each course, dropout risk score, and recommendations for improvement.
  `,
});

const forecastPerformanceFlow = ai.defineFlow(
  {
    name: 'forecastPerformanceFlow',
    inputSchema: ForecastPerformanceInputSchema,
    outputSchema: ForecastPerformanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
