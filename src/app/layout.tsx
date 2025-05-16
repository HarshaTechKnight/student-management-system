import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Toaster } from "@/components/ui/toaster";
import AppNavigation from '@/components/layout/app-navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CampusAI - Student Management System',
  description: 'AI-Driven Student Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 13H4a2 2 0 00-2 2v3a2 2 0 002 2h16a2 2 0 002-2v-3a2 2 0 00-2-2h-.5L12 9.5zM4 17v-2h16v2H4z"/>
                </svg>
                <h1 className="text-xl font-semibold text-foreground">CampusAI</h1>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <AppNavigation />
            </SidebarContent>
            <SidebarFooter className="p-4 border-t border-sidebar-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@campus.ai</p>
                </div>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end md:px-6">
              <SidebarTrigger className="sm:hidden" />
              {/* Add any header content here, like search or notifications */}
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
