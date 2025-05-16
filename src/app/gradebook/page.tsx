'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockCourses, mockStudents, mockGrades, mockEnrollments, Course, Student, Grade, Enrollment } from '@/lib/mock-data';
import { BookOpenCheck, Save, PlusCircle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GradeInput extends Grade {
  isEditing?: boolean;
  newScore?: number;
}

export default function GradebookPage() {
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [studentsInCourse, setStudentsInCourse] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeInput[]>([]);
  const [newAssignmentName, setNewAssignmentName] = useState('');

  useEffect(() => {
    if (selectedCourseId) {
      const enrolledStudentIds = mockEnrollments
        .filter(e => e.courseId === selectedCourseId && e.status === 'Enrolled')
        .map(e => e.studentId);
      
      const students = mockStudents.filter(s => enrolledStudentIds.includes(s.studentId));
      setStudentsInCourse(students);

      const courseGrades = mockGrades
        .filter(g => g.courseId === selectedCourseId)
        .map(g => ({ ...g, isEditing: false, newScore: g.score }));
      setGrades(courseGrades);
    } else {
      setStudentsInCourse([]);
      setGrades([]);
    }
  }, [selectedCourseId]);

  const handleGradeChange = (studentId: string, assignmentName: string, newScoreStr: string) => {
    const newScore = parseInt(newScoreStr, 10);
    if (isNaN(newScore) || newScore < 0 || newScore > 100) { // Assuming max score is 100 for simplicity
        // Potentially show an error or ignore
        return;
    }
    setGrades(prevGrades => 
      prevGrades.map(g => 
        g.studentId === studentId && g.assignmentName === assignmentName 
        ? { ...g, newScore: newScore } 
        : g
      )
    );
  };
  
  const toggleEditMode = (studentId: string, assignmentName: string) => {
    setGrades(prevGrades =>
      prevGrades.map(g =>
        g.studentId === studentId && g.assignmentName === assignmentName
          ? { ...g, isEditing: !g.isEditing, newScore: g.score } // Reset newScore on toggle
          : { ...g, isEditing: false } // Close other edit modes
      )
    );
  };


  const saveGrade = (studentId: string, assignmentName: string) => {
    // In a real app, this would be an API call
    const gradeToSave = grades.find(g => g.studentId === studentId && g.assignmentName === assignmentName);
    if (gradeToSave && typeof gradeToSave.newScore === 'number') {
      console.log('Saving grade:', { ...gradeToSave, score: gradeToSave.newScore });
      // Update mockGrades for persistence in this demo
      const gradeIndex = mockGrades.findIndex(g => g.studentId === studentId && g.assignmentName === assignmentName && g.courseId === selectedCourseId);
      if (gradeIndex !== -1) {
        mockGrades[gradeIndex].score = gradeToSave.newScore;
      }
      
      setGrades(prevGrades => 
        prevGrades.map(g => 
          g.studentId === studentId && g.assignmentName === assignmentName 
          ? { ...g, score: gradeToSave.newScore!, isEditing: false } 
          : g
        )
      );
      toast({ title: "Grade Saved", description: `Grade for ${assignmentName} for student ${studentId} updated.` });
    }
  };

  const addAssignmentColumn = () => {
    if (!newAssignmentName.trim() || !selectedCourseId) {
      toast({ title: "Error", description: "Please enter an assignment name.", variant: "destructive" });
      return;
    }
    if (grades.some(g => g.assignmentName === newAssignmentName)) {
      toast({ title: "Error", description: "Assignment name already exists for this course.", variant: "destructive" });
      return;
    }

    const newGradesForAssignment: GradeInput[] = studentsInCourse.map(student => ({
      studentId: student.studentId,
      courseId: selectedCourseId,
      assignmentName: newAssignmentName,
      score: 0, // Default score
      total: 100, // Default total
      isEditing: false,
      newScore: 0,
    }));

    // Add to mockGrades for persistence in this demo
    newGradesForAssignment.forEach(ng => mockGrades.push({...ng, score: ng.newScore ?? 0}));


    setGrades(prevGrades => [...prevGrades, ...newGradesForAssignment]);
    setNewAssignmentName('');
    toast({ title: "Assignment Added", description: `New assignment "${newAssignmentName}" added.` });
  };
  
  const uniqueAssignments = Array.from(new Set(grades.map(g => g.assignmentName))).sort();

  return (
    <>
      <PageHeader 
        title="Gradebook" 
        icon={BookOpenCheck}
        description="Manage student grades for courses."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Course Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {mockCourses.map((course: Course) => (
                <SelectItem key={course.courseId} value={course.courseId}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCourseId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Grades for {mockCourses.find(c => c.courseId === selectedCourseId)?.title}</span>
               <div className="flex items-center gap-2">
                <Input 
                  placeholder="New Assignment Name" 
                  value={newAssignmentName}
                  onChange={(e) => setNewAssignmentName(e.target.value)}
                  className="w-[200px]"
                />
                <Button onClick={addAssignmentColumn} size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Assignment
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              <Users className="inline mr-1 h-4 w-4" /> {studentsInCourse.length} students enrolled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studentsInCourse.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Student Name</TableHead>
                      {uniqueAssignments.map(assignmentName => (
                        <TableHead key={assignmentName} className="text-center min-w-[150px]">{assignmentName}</TableHead>
                      ))}
                      <TableHead className="text-center min-w-[100px]">Average</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsInCourse.map((student) => {
                      const studentSpecificGrades = grades.filter(g => g.studentId === student.studentId);
                      let totalScore = 0;
                      let numAssignments = 0;
                      studentSpecificGrades.forEach(g => {
                        totalScore += (g.score / g.total) * 100;
                        numAssignments++;
                      });
                      const average = numAssignments > 0 ? (totalScore / numAssignments).toFixed(1) + '%' : 'N/A';

                      return (
                        <TableRow key={student.studentId}>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          {uniqueAssignments.map(assignmentName => {
                            const grade = studentSpecificGrades.find(g => g.assignmentName === assignmentName);
                            return (
                              <TableCell key={assignmentName} className="text-center">
                                {grade ? (
                                  grade.isEditing ? (
                                    <div className="flex items-center gap-1 justify-center">
                                      <Input
                                        type="number"
                                        value={grade.newScore ?? ''}
                                        onChange={(e) => handleGradeChange(student.studentId, assignmentName, e.target.value)}
                                        className="h-8 w-16 text-center"
                                        max={grade.total}
                                        min={0}
                                      />
                                      <span>/ {grade.total}</span>
                                      <Button onClick={() => saveGrade(student.studentId, assignmentName)} size="icon" variant="ghost" className="h-8 w-8">
                                        <Save className="h-4 w-4 text-primary" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <span onClick={() => toggleEditMode(student.studentId, assignmentName)} className="cursor-pointer hover:bg-muted p-1 rounded">
                                      {grade.score}/{grade.total}
                                    </span>
                                  )
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-center font-medium">{average}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground">No students enrolled in this course or no grades recorded yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
