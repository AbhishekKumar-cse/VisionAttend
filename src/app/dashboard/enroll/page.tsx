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
import { UserPlus, Wand2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EnrollUserPage() {
  const [formData, setFormData] = useState({ name: "", email: "", role: "User", groupId: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIAssistedFacialProfileCreationOutput | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();
  const groups = DataService.getGroups();

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
    if (!formData.name || !formData.email) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all details." });
      return;
    }

    DataService.saveUser({
      id: Math.random().toString(36).substr(2, 9),
      ...formData as any,
      enrolledAt: new Date().toISOString()
    });

    toast({ title: "User Enrolled", description: `${formData.name} is now part of the system.` });
    setFormData({ name: "", email: "", role: "User", groupId: "" });
    setCapturedImage(null);
    setAiFeedback(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-primary" />
            New User Enrollment
          </h1>
          <p className="text-muted-foreground mt-2">Securely capture identity details and facial data.</p>
        </header>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Enter the user's basic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({...formData, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">Standard User</SelectItem>
                    <SelectItem value="Admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department/Group</Label>
                <Select value={formData.groupId} onValueChange={(v) => setFormData({...formData, groupId: v})}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>
                    {groups.map(g => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
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
                  AI Enrollment Assistant
                </CardTitle>
                <Badge variant={aiFeedback.isOptimal ? "default" : "secondary"}>
                  {aiFeedback.isOptimal ? "Optimal Quality" : "Adjustments Needed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed text-slate-700 italic">"{aiFeedback.feedback}"</p>
              
              {!aiFeedback.isOptimal && aiFeedback.issues.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-orange-600">Pending Issues</Label>
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
                  Complete Enrollment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <div className="sticky top-8">
          <Label className="block mb-4 font-bold text-lg">Biometric Capture</Label>
          <CameraView onCapture={handleCapture} isLoading={isProcessing} />
          
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            End-to-end encrypted biometric profile generation.
          </div>
        </div>
      </div>
    </div>
  );
}
