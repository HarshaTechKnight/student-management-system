'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockCourses, mockStudents, mockAttendance, mockEnrollments, Course, Student, AttendanceEntry, Enrollment } from '@/lib/mock-data';
import { CalendarCheck, CalendarIcon, Save, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface AttendanceRecord extends AttendanceEntry {
  studentName: string;
}

export default function AttendancePage() {
  const { toast } = useToast();
  const [selectedCourseId, setSelectedCourseId] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [studentsInCourse, setStudentsInCourse] = useState<Student[]>([]);
  
  // This state will hold the current session's modifications before saving
  const [sessionAttendance, setSessionAttendance] = useState<Record<string, boolean>>({}); // studentId -> present status

  useEffect(() => {
    if (selectedCourseId && selectedDate) {
      const enrolledStudentIds = mockEnrollments
        .filter(e => e.courseId === selectedCourseId && e.status === 'Enrolled')
        .map(e => e.studentId);
      
      const currentStudents = mockStudents.filter(s => enrolledStudentIds.includes(s.studentId));
      setStudentsInCourse(currentStudents);
      
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const records: AttendanceRecord[] = currentStudents.map(student => {
        const existingRecord = mockAttendance.find(
          a => a.studentId === student.studentId && a.courseId === selectedCourseId && a.date === dateString
        );
        return {
          studentId: student.studentId,
          studentName: student.fullName,
          courseId: selectedCourseId,
          date: dateString,
          present: existingRecord ? existingRecord.present : false, // Default to absent if no record
        };
      });
      setAttendanceRecords(records);
      
      // Initialize sessionAttendance from records
      const initialSessionAttendance: Record<string, boolean> = {};
      records.forEach(rec => {
        initialSessionAttendance[rec.studentId] = rec.present;
      });
      setSessionAttendance(initialSessionAttendance);

    } else {
      setStudentsInCourse([]);
      setAttendanceRecords([]);
      setSessionAttendance({});
    }
  }, [selectedCourseId, selectedDate]);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setSessionAttendance(prev => ({ ...prev, [studentId]: present }));
  };

  const saveAttendance = () => {
    if (!selectedCourseId || !selectedDate) return;
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    
    Object.entries(sessionAttendance).forEach(([studentId, present]) => {
      const existingRecordIndex = mockAttendance.findIndex(
        a => a.studentId === studentId && a.courseId === selectedCourseId && a.date === dateString
      );
      if (existingRecordIndex !== -1) {
        mockAttendance[existingRecordIndex].present = present;
      } else {
        mockAttendance.push({ studentId, courseId: selectedCourseId, date: dateString, present });
      }
    });

    // Refresh displayed records from mockData (which is now updated)
    const updatedRecords = studentsInCourse.map(student => {
        const record = mockAttendance.find(a => a.studentId === student.studentId && a.courseId === selectedCourseId && a.date === dateString);
        return {
            studentId: student.studentId,
            studentName: student.fullName,
            courseId: selectedCourseId,
            date: dateString,
            present: record ? record.present : false,
        };
    });
    setAttendanceRecords(updatedRecords);

    toast({ title: "Attendance Saved", description: `Attendance for ${format(selectedDate, 'PPP')} has been saved.` });
  };

  return (
    <>
      <PageHeader 
        title="Attendance Tracking" 
        icon={CalendarCheck}
        description="Mark and view student attendance for courses."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="course-select">Course</Label>
            <Select onValueChange={setSelectedCourseId} value={selectedCourseId}>
              <SelectTrigger id="course-select" className="w-full">
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
          </div>
          <div className="flex-1">
            <Label htmlFor="date-picker">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {selectedCourseId && selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Attendance for {mockCourses.find(c => c.courseId === selectedCourseId)?.title} on {format(selectedDate, 'PPP')}</span>
              <Button onClick={saveAttendance} disabled={Object.keys(sessionAttendance).length === 0}>
                <Save className="mr-2 h-4 w-4" /> Save Attendance
              </Button>
            </CardTitle>
             <CardDescription>
              <Users className="inline mr-1 h-4 w-4" /> {studentsInCourse.length} students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead className="text-center w-[100px]">Present</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.studentId}>
                      <TableCell className="font-medium">{record.studentName}</TableCell>
                      <TableCell>{record.studentId}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={sessionAttendance[record.studentId] || false}
                          onCheckedChange={(checked) => handleAttendanceChange(record.studentId, !!checked)}
                          aria-label={`Mark ${record.studentName} as ${sessionAttendance[record.studentId] ? 'absent' : 'present'}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-muted-foreground">No students enrolled in this course for the selected date, or attendance not yet taken.</p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
