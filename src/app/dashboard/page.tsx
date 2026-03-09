"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataService } from "@/lib/data-service";
import { AttendanceRecord, VisionUser } from "@/lib/types";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  TrendingUp, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { generateAttendanceInsights, GenerateAttendanceInsightsOutput } from "@/ai/flows/generate-attendance-insights-flow";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
        const result = await generateAttendanceInsights({ attendanceData: r });
        setInsights(result);
      } catch (err) {
        console.error("Failed to generate insights", err);
      } finally {
        setLoadingInsights(false);
      }
    }

    fetchInsights();
  }, []);

  const stats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
    { label: "Today's Attendance", value: records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString()).length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Late Check-ins", value: records.filter(r => r.status === 'Late').length, icon: Clock, color: "text-orange-500" },
    { label: "Absentees", value: users.length - records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString()).length, icon: XCircle, color: "text-destructive" },
  ];

  const chartData = [
    { name: "Present", value: records.filter(r => r.status === 'Present').length, fill: "hsl(var(--primary))" },
    { name: "Late", value: records.filter(r => r.status === 'Late').length, fill: "hsl(var(--accent))" },
    { name: "Absent", value: 5, fill: "hsl(var(--muted-foreground))" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Attendance Overview</h1>
        <p className="text-muted-foreground">Real-time performance monitoring and AI-powered data insights.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white">
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
              <TrendingUp className="w-5 h-5 text-primary" />
              Weekly Trends
            </CardTitle>
            <CardDescription>Visualizing check-in volume over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden relative">
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Insights
            </CardTitle>
            <CardDescription>Automated pattern analysis</CardDescription>
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
                  <h4 className="text-xs font-semibold uppercase text-muted-foreground">Identified Trends</h4>
                  <ul className="space-y-1">
                    {insights.identifiedTrends.map((trend, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Badge variant="outline" className="mt-0.5 px-1 py-0 h-4 text-[10px] bg-accent/10 text-accent border-accent/20">NEW</Badge>
                        {trend}
                      </li>
                    ))}
                  </ul>
                </div>
                {insights.unusualPatterns.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-destructive mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">Attention Required</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{insights.unusualPatterns[0].patternDescription}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-sm text-muted-foreground">Not enough data yet to generate insights. Enroll users and start marking attendance.</p>
              </div>
            )}
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest attendance logs from all departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-secondary/50">
                <tr className="text-left">
                  <th className="p-4 font-medium">User</th>
                  <th className="p-4 font-medium">Group</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Time</th>
                  <th className="p-4 font-medium text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.length > 0 ? records.slice(0, 10).map((record) => (
                  <tr key={record.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-medium">{record.userName}</td>
                    <td className="p-4 text-muted-foreground">{record.groupName || "General"}</td>
                    <td className="p-4">
                      <Badge 
                        variant={record.status === 'Present' ? 'default' : record.status === 'Late' ? 'secondary' : 'destructive'}
                        className="font-medium"
                      >
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right tabular-nums">
                      {Math.round(record.confidence * 100)}%
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">No records found today.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}