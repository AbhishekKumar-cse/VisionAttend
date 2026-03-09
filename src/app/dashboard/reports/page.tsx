"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DataService } from "@/lib/data-service";
import { AttendanceRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ReportsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [searchTerm, setSearchName] = useState("");

  useEffect(() => {
    setRecords(DataService.getAttendance());
  }, []);

  const filtered = records.filter(r => 
    r.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-headline">Historical Reports</h1>
          <p className="text-muted-foreground">View and export all attendance logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </header>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search user name..." 
              className="pl-10 h-12 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative w-full overflow-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr className="text-left border-b">
                  <th className="p-4 font-bold">Timestamp</th>
                  <th className="p-4 font-bold">User</th>
                  <th className="p-4 font-bold">Department</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.length > 0 ? filtered.map((record) => (
                  <tr key={record.id} className="hover:bg-primary/[0.02] transition-colors">
                    <td className="p-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(record.timestamp).toLocaleDateString()}
                        <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                          {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{record.userName}</td>
                    <td className="p-4 text-muted-foreground">{record.groupName || "General"}</td>
                    <td className="p-4">
                      <Badge 
                        variant={record.status === 'Present' ? 'default' : 'secondary'}
                        className="rounded-md px-2 py-0.5 h-6"
                      >
                        {record.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right tabular-nums font-medium">
                      {Math.round(record.confidence * 100)}%
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground italic">No attendance records found matching your search.</td>
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