'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { forecastPerformance, ForecastPerformanceInput, ForecastPerformanceOutput } from '@/ai/flows/performance-forecasting';
import { BrainCircuit, Loader2, LineChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  historicalGrades: z.string().min(1, "Historical grades are required")
    .refine(val => {
      try { JSON.parse(val); return true; } catch { return false; }
    }, "Historical grades must be valid JSON")
    .transform(val => JSON.parse(val) as { course: string; grade: number }[]),
  attendanceRate: z.coerce.number().min(0).max(100, "Attendance rate must be between 0 and 100"),
  courseDifficulty: z.string().min(1, "Course difficulty is required (e.g., Easy, Medium, Hard)"),
});

type PerformanceForecastFormValues = z.infer<typeof formSchema>;

export default function PerformanceForecastingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<ForecastPerformanceOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<PerformanceForecastFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      historicalGrades: JSON.stringify([{ course: "Math", grade: 75 }, { course: "Science", grade: 80 }], null, 2),
      attendanceRate: 90,
      courseDifficulty: 'Medium',
    },
  });

  const onSubmit = async (data: PerformanceForecastFormValues) => {
    setIsLoading(true);
    setError(null);
    setForecastResult(null);
    try {
      // The schema expects historicalGrades as an array of objects,
      // form data is already transformed by Zod.
      const inputData: ForecastPerformanceInput = {
        studentId: data.studentId,
        historicalGrades: data.historicalGrades,
        attendanceRate: data.attendanceRate,
        courseDifficulty: data.courseDifficulty,
      };
      const result = await forecastPerformance(inputData);
      setForecastResult(result);
      toast({ title: "Forecast Generated", description: "Student performance forecast is ready." });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Error", description: `Failed to generate forecast: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Performance Forecasting" 
        icon={LineChart}
        description="Predict student performance trends based on historical data."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Student Data</CardTitle>
            <CardDescription>Enter student details to generate a performance forecast.</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" {...form.register("studentId")} />
                {form.formState.errors.studentId && <p className="text-sm text-destructive mt-1">{form.formState.errors.studentId.message}</p>}
              </div>
              <div>
                <Label htmlFor="historicalGrades">Historical Grades (JSON format)</Label>
                <Textarea 
                  id="historicalGrades" 
                  {...form.register("historicalGrades")} 
                  rows={5}
                  placeholder='[{"course": "Math", "grade": 75}, {"course": "Science", "grade": 80}]'
                />
                {form.formState.errors.historicalGrades && <p className="text-sm text-destructive mt-1">{form.formState.errors.historicalGrades.message}</p>}
              </div>
              <div>
                <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
                <Input id="attendanceRate" type="number" {...form.register("attendanceRate")} />
                {form.formState.errors.attendanceRate && <p className="text-sm text-destructive mt-1">{form.formState.errors.attendanceRate.message}</p>}
              </div>
              <div>
                <Label htmlFor="courseDifficulty">Course Difficulty</Label>
                <Input id="courseDifficulty" {...form.register("courseDifficulty")} placeholder="e.g., Easy, Medium, Hard" />
                {form.formState.errors.courseDifficulty && <p className="text-sm text-destructive mt-1">{form.formState.errors.courseDifficulty.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Generate Forecast
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoading || forecastResult || error) && (
          <Card>
            <CardHeader>
              <CardTitle>Forecast Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Generating forecast...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {forecastResult && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Projected Grades:</h3>
                    <ul className="list-disc list-inside pl-4 mt-1">
                      {forecastResult.projectedGrades.map((pg, index) => (
                        <li key={index} className="text-sm">
                          {pg.course}: <span className="font-medium">{pg.projectedGrade}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Dropout Risk Score:</h3>
                    <p className={`text-xl font-bold ${forecastResult.dropoutRiskScore > 70 ? 'text-destructive' : forecastResult.dropoutRiskScore > 40 ? 'text-yellow-500' : 'text-green-600'}`}>
                      {forecastResult.dropoutRiskScore}%
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Recommendations:</h3>
                    <p className="text-sm whitespace-pre-wrap">{forecastResult.recommendations}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
