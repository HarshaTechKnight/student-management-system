import PageHeader from '@/components/shared/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockStudents, Student } from '@/lib/mock-data';
import { Users, MoreHorizontal, PlusCircle, Search, FileDown } from 'lucide-react';
import Link from 'next/link';

export default function StudentsPage() {
  // In a real app, this data would come from an API
  const students: Student[] = mockStudents;

  return (
    <>
      <PageHeader 
        title="Student Profiles" 
        icon={Users}
        description="Manage and view student information."
        actions={
          <>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Export List
            </Button>
            <Link href="/students/new">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Student
              </Button>
            </Link>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <div className="mt-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search students..." className="pl-8 w-full md:w-1/3" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Grade Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Guardian Contact</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={student.profilePictureUrl} alt={student.fullName} data-ai-hint="person portrait" />
                      <AvatarFallback>{student.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/students/${student.studentId}`} className="hover:underline text-primary">
                      {student.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{student.gradeLevel}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}
                           className={student.status === 'Active' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-400 border-green-500/30' 
                                      : student.status === 'Inactive' ? 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-400 border-red-500/30' 
                                      : 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400 border-blue-500/30'}>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{student.guardianContact}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Link href={`/students/${student.studentId}`} passHref>
                           <DropdownMenuItem>View Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          Deactivate Student
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
