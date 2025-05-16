import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, BookOpenCheck, AlertTriangle, Home } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  const stats = [
    { title: 'Total Students', value: '1,250', icon: Users, trend: '+5% this month' },
    { title: 'Active Courses', value: '85', icon: BookOpenCheck, trend: '+2 new courses' },
    { title: 'At-Risk Students', value: '42', icon: AlertTriangle, trend: 'View Details', color: 'text-destructive' },
    { title: 'Average Attendance', value: '92%', icon: BarChart, trend: '+1.5% this week' },
  ];

  return (
    <>
      <PageHeader title="Dashboard" icon={Home} description="Overview of CampusAI system metrics and activities." />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications within the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                { text: 'New student enrollment: S1005 - Emily White', time: '10 min ago' },
                { text: 'Gradebook updated for Physics 101 by Dr. Reed', time: '1 hour ago' },
                { text: 'AI Alert: S1003 potential dropout risk detected', time: '3 hours ago' },
                { text: 'Attendance marked for Calculus I', time: 'Yesterday' },
              ].map(item => (
                <li key={item.text} className="flex items-start justify-between">
                  <span className="text-sm text-foreground">{item.text}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>System Announcements</CardTitle>
            <CardDescription>Important messages and updates for all users.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center">
              <Image src="https://placehold.co/300x200.png" alt="CampusAI Feature" width={300} height={200} className="rounded-md mb-4" data-ai-hint="education technology" />
              <h3 className="text-lg font-semibold mb-1">Welcome to CampusAI!</h3>
              <p className="text-sm text-muted-foreground">
                Explore the new AI-powered features to enhance student management and academic insights.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
