
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BookOpenCheck, CalendarCheck, BrainCircuit, LineChart, AlertTriangle } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/gradebook', label: 'Gradebook', icon: BookOpenCheck },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck },
];

const aiInsightsNavItems = [
  { href: '/ai-insights/performance-forecasting', label: 'Performance Forecasting', icon: LineChart },
  { href: '/ai-insights/dropout-risk', label: 'Dropout Risk', icon: AlertTriangle },
];

export default function AppNavigation() {
  const pathname = usePathname();

  return (
    <SidebarMenu className="p-2">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <Link href={item.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="w-full justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
      <SidebarMenuItem>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-insights" className="border-none">
            <AccordionTrigger 
              className={cn(
                "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg:last-child]:ml-auto [&_svg:last-child]:!size-4",
                (pathname.startsWith('/ai-insights')) && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              )}
            >
              <BrainCircuit className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">AI Insights</span>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pl-4">
              <SidebarMenu className="gap-0.5">
                {aiInsightsNavItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <Link href={item.href} legacyBehavior passHref>
                      <SidebarMenuButton
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        size="sm"
                        className="w-full justify-start"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
