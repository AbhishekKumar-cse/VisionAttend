"use client";

import { useState } from "react";
import { CameraView } from "@/components/attendance/camera-view";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { aiAssistedFacialProfileCreation, AIAssistedFacialProfileCreationOutput } from "@/ai/flows/ai-assisted-facial-profile-creation";
import { useToast } from "@/hooks/use-toast";
import { DataService } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Wand2, ShieldCheck, AlertTriangle, IdCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/lib/types";

export default function EnrollUserPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    role: "Student" as UserRole, 
    departmentId: "",
    externalId: "",
    academicYear: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIAssistedFacialProfileCreationOutput | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const departments = DataService.getDepartments();

  const handleCapture = async (imageDataUri: string) => {
    setIsProcessing(true);
    setCapturedImage(imageDataUri);
    try {
      const result = await aiAssistedFacialProfileCreation({ imageDataUri });
      setAiFeedback(result);
      
      if (!result.isOptimal) {
        toast({
          variant: "destructive",
          title: "Profile Needs Improvement",
          description: result.issues[0] || "Check the feedback details below.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ variant: "destructive", title: "AI Error", description: "Feedback analysis failed." });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnroll = () => {
    if (!formData.name || !formData.email || !formData.externalId) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill in all mandatory fields." });
      return;
    }

    DataService.saveUser({
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      enrolledAt: new Date().toISOString()
    });

    toast({ title: "Enrollment Complete", description: `${formData.role} ${formData.name} has been enrolled.` });
    setFormData({ name: "", email: "", role: "Student", departmentId: "", externalId: "", academicYear: "" });
    setCapturedImage(null);
    setAiFeedback(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto py-6">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            Campus Enrollment
          </h1>
          <p className="text-muted-foreground mt-2">Register new Students and Professors into the biometric system.</p>
        </header>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Academic Profile</CardTitle>
            <CardDescription>Enter the basic institutional identity details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="externalId">ID Number (Student/Staff)</Label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="externalId" 
                    className="pl-10"
                    placeholder="STU-2024-001" 
                    value={formData.externalId}
                    onChange={(e) => setFormData({...formData, externalId: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Campus Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v as UserRole})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Staff">Staff Member</SelectItem>
                    <SelectItem value="Admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Dr. Jane Doe or John Smith" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={formData.departmentId} onValueChange={(v) => setFormData({...formData, departmentId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select faculty" /></SelectTrigger>
                  <SelectContent>
                    {departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'Student' && (
                <div className="space-y-2">
                  <Label>Academic Year</Label>
                  <Select value={formData.academicYear} onValueChange={(v) => setFormData({...formData, academicYear: v})}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Freshman">Freshman</SelectItem>
                      <SelectItem value="Sophomore">Sophomore</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Postgrad">Postgraduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Institutional Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@university.edu" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {aiFeedback && (
          <Card className={cn(
            "border-none shadow-lg overflow-hidden animate-in slide-in-from-bottom duration-500",
            aiFeedback.isOptimal ? "bg-green-50 ring-1 ring-green-200" : "bg-orange-50 ring-1 ring-orange-200"
          )}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Facial Quality Assistant
                </CardTitle>
                <Badge variant={aiFeedback.isOptimal ? "default" : "secondary"}>
                  {aiFeedback.isOptimal ? "Optimal Scan" : "Action Required"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-700 italic">"{aiFeedback.feedback}"</p>
              
              {!aiFeedback.isOptimal && aiFeedback.issues.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-orange-600">Issues to Resolve</Label>
                  <div className="flex flex-wrap gap-2">
                    {aiFeedback.issues.map(issue => (
                      <Badge key={issue} variant="outline" className="bg-white border-orange-200 text-orange-700">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiFeedback.isOptimal && (
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleEnroll}>
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Confirm Academic Enrollment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <div className="sticky top-8">
          <Label className="block mb-4 font-bold text-lg">Identity Capture</Label>
          <CameraView onCapture={handleCapture} isLoading={isProcessing} />
          
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground justify-center p-4 rounded-xl bg-secondary/20">
            <BookOpen className="w-4 h-4 text-primary" />
            Biometric data is securely stored for campus verification.
          </div>
        </div>
      </div>
    </div>
  );
}
