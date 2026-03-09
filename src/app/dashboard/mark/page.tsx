"use client";

import { useState } from "react";
import { CameraView } from "@/components/attendance/camera-view";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { markAttendanceWithFaceRecognition } from "@/ai/flows/ai-powered-attendance-marking-flow";
import { useToast } from "@/hooks/use-toast";
import { DataService } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, UserCircle2, ShieldCheck, AlertCircle } from "lucide-react";

export default function MarkAttendancePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ name: string; time: string; confidence: number } | null>(null);
  const { toast } = useToast();

  const handleCapture = async (imageDataUri: string) => {
    setIsProcessing(true);
    try {
      const result = await markAttendanceWithFaceRecognition({ 
        facialImageDataUri: imageDataUri,
        context: "Front desk check-in"
      });

      if (result.isRecognized && result.userName) {
        const record = {
          id: Math.random().toString(36).substr(2, 9),
          userId: result.userId || "unknown",
          userName: result.userName,
          timestamp: new Date().toISOString(),
          status: "Present" as const,
          confidence: result.confidence || 0.95,
        };
        
        DataService.saveAttendance(record);
        setLastResult({
          name: result.userName,
          time: new Date().toLocaleTimeString(),
          confidence: result.confidence || 0.95
        });

        toast({
          title: "Attendance Marked",
          description: `Verified check-in for ${result.userName}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Recognition Failed",
          description: result.message || "We couldn't verify your identity. Please try again.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during facial processing.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold font-headline">Mark Attendance</h1>
        <p className="text-muted-foreground">Position your face within the frame for instant AI verification.</p>
      </div>

      <CameraView onCapture={handleCapture} isLoading={isProcessing} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              Last Recognition
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lastResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <UserCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{lastResult.name}</p>
                    <p className="text-sm text-muted-foreground">{lastResult.time}</p>
                  </div>
                  <Badge className="ml-auto bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {Math.round(lastResult.confidence * 100)}% Match
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  Securely verified by VisionAttend AI
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground text-sm">
                Waiting for check-in...
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">1</div>
              Ensure good lighting on your face.
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">2</div>
              Look directly at the camera.
            </div>
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">3</div>
              Remove face coverings or heavy glasses if possible.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}