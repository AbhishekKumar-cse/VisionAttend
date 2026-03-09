"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  GraduationCap, 
  ScanFace, 
  FileText, 
  Users,
  LogOut,
  School
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Campus Overview", icon: LayoutDashboard },
  { href: "/dashboard/mark", label: "ID Verification", icon: ScanFace },
  { href: "/dashboard/enroll", label: "Enroll Student/Staff", icon: GraduationCap },
  { href: "/dashboard/reports", label: "Attendance Reports", icon: FileText },
  { href: "/dashboard/users", label: "Academic Directory", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <School className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary font-headline">EduAttend AI</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all",
                pathname === item.href
                  ? "bg-primary text-white shadow-md scale-105"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t">
        <div className="flex items-center gap-3 px-3 py-2 mb-4 bg-secondary/30 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-white">
            RD
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">Registrar Office</span>
            <span className="text-[10px] text-muted-foreground">registrar@university.edu</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5" asChild>
          <Link href="/">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Link>
        </Button>
      </div>
    </div>
  );
}
