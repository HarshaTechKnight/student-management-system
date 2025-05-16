'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { predictDropoutRisk, DropoutRiskInput, DropoutRiskOutput } from '@/ai/flows/dropout-risk-prediction';
import { BrainCircuit, Loader2, AlertTriangle as PageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  attendanceRate: z.coerce.number().min(0).max(1, "Attendance rate must be between 0.0 and 1.0 (e.g., 0.85 for 85%)"),
  feePaymentDelay: z.coerce.number().min(0, "Fee payment delay cannot be negative"),
  grades: z.string().min(1, "Grades are required")
    .refine(val => {
      try { JSON.parse(val); return true; } catch { return false; }
    }, "Grades must be valid JSON")
    .transform(val => JSON.parse(val) as Record<string, number>),
});

type DropoutRiskFormValues = z.infer<typeof formSchema>;

export default function DropoutRiskPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<DropoutRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DropoutRiskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      attendanceRate: 0.85,
      feePaymentDelay: 0,
      grades: JSON.stringify({ "Math": 65, "Science": 70, "History": 55 }, null, 2),
    },
  });

  const onSubmit = async (data: DropoutRiskFormValues) => {
    setIsLoading(true);
    setError(null);
    setPredictionResult(null);
    try {
      const inputData: DropoutRiskInput = {
        studentId: data.studentId,
        attendanceRate: data.attendanceRate,
        feePaymentDelay: data.feePaymentDelay,
        grades: data.grades,
      };
      const result = await predictDropoutRisk(inputData);
      setPredictionResult(result);
      toast({ title: "Prediction Generated", description: "Dropout risk prediction is ready." });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Error", description: `Failed to generate prediction: ${errorMessage}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Dropout Risk Prediction" 
        icon={PageIcon}
        description="Identify students at risk of dropping out using AI analysis."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Student Data</CardTitle>
            <CardDescription>Enter student details to predict dropout risk.</CardDescription>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" {...form.register("studentId")} />
                {form.formState.errors.studentId && <p className="text-sm text-destructive mt-1">{form.formState.errors.studentId.message}</p>}
              </div>
              <div>
                <Label htmlFor="attendanceRate">Attendance Rate (0.0 - 1.0)</Label>
                <Input id="attendanceRate" type="number" step="0.01" {...form.register("attendanceRate")} placeholder="e.g., 0.85 for 85%" />
                {form.formState.errors.attendanceRate && <p className="text-sm text-destructive mt-1">{form.formState.errors.attendanceRate.message}</p>}
              </div>
              <div>
                <Label htmlFor="feePaymentDelay">Fee Payment Delay (days)</Label>
                <Input id="feePaymentDelay" type="number" {...form.register("feePaymentDelay")} />
                {form.formState.errors.feePaymentDelay && <p className="text-sm text-destructive mt-1">{form.formState.errors.feePaymentDelay.message}</p>}
              </div>
              <div>
                <Label htmlFor="grades">Grades (JSON format: {"{course: score}"})</Label>
                <Textarea 
                  id="grades" 
                  {...form.register("grades")} 
                  rows={4}
                  placeholder='{"Math": 65, "Science": 70, "History": 55}'
                />
                {form.formState.errors.grades && <p className="text-sm text-destructive mt-1">{form.formState.errors.grades.message}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Predict Dropout Risk
              </Button>
            </CardFooter>
          </form>
        </Card>

        {(isLoading || predictionResult || error) && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Generating prediction...</p>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {predictionResult && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Dropout Risk Score:</h3>
                    <p className={`text-3xl font-bold ${predictionResult.dropoutRiskScore > 70 ? 'text-destructive' : predictionResult.dropoutRiskScore > 40 ? 'text-yellow-500' : 'text-green-600'}`}>
                      {predictionResult.dropoutRiskScore}%
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Reason Codes:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {predictionResult.reasonCodes.map((code, index) => (
                        <Badge key={index} variant="secondary">{code.replace(/_/g, ' ')}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Suggestions:</h3>
                    <p className="text-sm whitespace-pre-wrap">{predictionResult.suggestions}</p>
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
