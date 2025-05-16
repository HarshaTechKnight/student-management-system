'use client';

import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/shared/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockStudents, mockCourses, mockGrades, mockAttendance, mockEnrollments, Student, Course, Grade, AttendanceEntry, Enrollment } from '@/lib/mock-data';
import { ArrowLeft, User, CalendarDays, BookOpen, Percent, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  // In a real app, fetch student data based on studentId
  const student = mockStudents.find(s => s.studentId === studentId);
  const studentEnrollments = mockEnrollments.filter(e => e.studentId === studentId);
  const studentGrades = mockGrades.filter(g => g.studentId === studentId);
  const studentAttendance = mockAttendance.filter(a => a.studentId === studentId);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-muted-foreground">Student not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const getCourseTitle = (courseId: string) => mockCourses.find(c => c.courseId === courseId)?.title || 'Unknown Course';

  return (
    <>
      <PageHeader 
        title={student.fullName}
        icon={User}
        description={`Detailed profile for ${student.studentId}`}
        actions={
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Students
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={student.profilePictureUrl} alt={student.fullName} data-ai-hint="student portrait" />
                <AvatarFallback className="text-3xl">{student.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{student.fullName}</CardTitle>
              <CardDescription>{student.studentId} - {student.gradeLevel}</CardDescription>
              <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}
                     className={`mt-2 ${student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                {student.status}
              </Badge>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-2">
                <div className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {student.email || 'N/A'}</div>
                <div className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {student.guardianContact}</div>
                <div className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" /> {student.address || 'N/A'}</div>
                <div className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> DOB: {new Date(student.dob).toLocaleDateString()}</div>
                <div className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" /> Enrolled: {student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Enrolled Courses</CardTitle>
            </CardHeader>
            <CardContent>
              {studentEnrollments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentEnrollments.map(enrollment => (
                      <TableRow key={enrollment.courseId}>
                        <TableCell>{getCourseTitle(enrollment.courseId)}</TableCell>
                        <TableCell>{enrollment.semester}</TableCell>
                        <TableCell><Badge variant={enrollment.status === 'Enrolled' ? 'default' : 'outline'}>{enrollment.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : <p className="text-muted-foreground">No courses enrolled.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><Percent className="mr-2 h-5 w-5 text-primary" /> Recent Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {studentGrades.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentGrades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell>{getCourseTitle(grade.courseId)}</TableCell>
                      <TableCell>{grade.assignmentName}</TableCell>
                      <TableCell>{grade.score}/{grade.total} ({(grade.score/grade.total*100).toFixed(1)}%)</TableCell>
                      <TableCell>{grade.date ? new Date(grade.date).toLocaleDateString() : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              ) : <p className="text-muted-foreground">No grades recorded.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5 text-primary" /> Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {studentAttendance.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.slice(0, 5).map((att, index) => ( // Show recent 5
                    <TableRow key={index}>
                      <TableCell>{getCourseTitle(att.courseId)}</TableCell>
                      <TableCell>{new Date(att.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={att.present ? 'default' : 'destructive'}
                               className={att.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {att.present ? 'Present' : 'Absent'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              ) : <p className="text-muted-foreground">No attendance records found.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
