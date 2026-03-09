"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataService } from "@/lib/data-service";
import { AttendanceRecord, VisionUser } from "@/lib/types";
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle,
  Building2,
  CalendarDays
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { generateAttendanceInsights, GenerateAttendanceInsightsOutput } from "@/ai/flows/generate-attendance-insights-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<VisionUser[]>([]);
  const [insights, setInsights] = useState<GenerateAttendanceInsightsOutput | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const r = DataService.getAttendance();
    const u = DataService.getUsers();
    setRecords(r);
    setUsers(u);

    async function fetchInsights() {
      if (r.length === 0) {
        setLoadingInsights(false);
        return;
      }
      try {
        // Adapt flow input to academic terminology if needed, though schema is flexible
        const result = await generateAttendanceInsights({ 
          attendanceData: r.map(rec => ({
            userId: rec.userId,
            userName: rec.userName,
            timestamp: rec.timestamp,
            status: rec.status,
            groupName: rec.departmentName
          }))
        });
        setInsights(result);
      } catch (err) {
        console.error("Failed to generate campus insights", err);
      } finally {
        setLoadingInsights(false);
      }
    }

    fetchInsights();
  }, []);

  const today = new Date().toDateString();
  const todayRecords = records.filter(r => new Date(r.timestamp).toDateString() === today);

  const stats = [
    { label: "Total Students", value: users.filter(u => u.role === 'Student').length, icon: GraduationCap, color: "text-primary" },
    { label: "Faculty Members", value: users.filter(u => u.role === 'Professor').length, icon: Users, color: "text-accent" },
    { label: "Present Today", value: todayRecords.length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Late Arrivals", value: todayRecords.filter(r => r.status === 'Late').length, icon: Clock, color: "text-orange-500" },
  ];

  // Grouping records by department for the chart
  const deptStats = DataService.getDepartments().map(dept => ({
    name: dept.name,
    count: records.filter(r => r.departmentName === dept.name).length,
    fill: "hsl(var(--primary))"
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Campus Overview</Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Term Spring 2026</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Academic Dashboard</h1>
        <p className="text-muted-foreground">Real-time attendance tracking for students and faculty across all departments.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white hover:ring-1 hover:ring-primary/10 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Department Attendance
            </CardTitle>
            <CardDescription>Total scan volume by faculty/department</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {deptStats.some(d => d.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Building2 className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm italic">No departmental data available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative">
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Academic Insights
            </CardTitle>
            <CardDescription>AI-generated student behavior analysis</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            {loadingInsights ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : insights ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-sm leading-relaxed text-foreground italic">"{insights.overallSummary}"</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Campus Trends</h4>
                  <ul className="space-y-1">
                    {insights.identifiedTrends.map((trend, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <div className="mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
                {insights.unusualPatterns.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Dean's Attention Required</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{insights.unusualPatterns[0].patternDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-sm text-muted-foreground">Start scanning student and faculty IDs to generate AI reports.</p>
              </div>
            )}
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </Card>
      </div>
    </div>
  );
}
