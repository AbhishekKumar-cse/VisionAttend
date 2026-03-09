"use client";

import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";
import { VisionUser } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, UserCheck, Shield, Trash2, Mail, GraduationCap, School } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<VisionUser[]>([]);
  const departments = DataService.getDepartments();

  useEffect(() => {
    setUsers(DataService.getUsers());
  }, []);

  const getDeptName = (id?: string) => departments.find(d => d.id === id)?.name || "Unassigned";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Campus Directory</h1>
        <p className="text-muted-foreground">Manage student and faculty biometric enrollment records.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="border-none shadow-sm bg-white overflow-hidden group hover:ring-2 hover:ring-primary/20 transition-all">
            <CardHeader className="pb-4 border-b border-secondary flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className={cn(
                    "font-bold",
                    user.role === 'Professor' ? "bg-accent/10 text-accent" : "bg-primary/5 text-primary"
                  )}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base font-bold">{user.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Badge variant="outline" className={cn(
                      "px-1 py-0 h-4 text-[9px] border-none uppercase",
                      user.role === 'Professor' ? "bg-accent/10 text-accent" : "bg-secondary/50"
                    )}>
                      {user.role}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Identity Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Verify Enrollment
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="w-4 h-4 mr-2" />
                    Modify Clearance
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove from System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <School className="w-3.5 h-3.5" />
                {getDeptName(user.departmentId)}
              </div>
              {user.academicYear && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {user.academicYear} Year
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-mono bg-secondary px-1 py-0 text-[10px] rounded uppercase tracking-wider">
                  {user.externalId}
                </Badge>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Biometric Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium">Identity Profile Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
