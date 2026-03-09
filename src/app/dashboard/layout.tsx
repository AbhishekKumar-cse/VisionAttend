"use client";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { useEffect } from "react";
import { DataService } from "@/lib/data-service";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    DataService.seedDemoData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="w-64 flex-shrink-0 hidden md:block">
        <SidebarNav />
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}