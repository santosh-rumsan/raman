'use client';

import AuthGuard from '@/guards/auth-guard';
import { AppSidebar } from '@/layouts/admin/sidebar';
import { Separator } from '@rumsan/shadcn-ui/components/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@rumsan/shadcn-ui/components/sidebar';
import { ReactNode } from 'react';

export default function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="text-lg font-bold">{title}</div>
            </div>
          </header>
          <>{children}</>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
