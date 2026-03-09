"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCcw, Scan } from "lucide-react";

interface CameraViewProps {
  onCapture: (dataUri: string) => void;
  isLoading?: boolean;
}

export function CameraView({ onCapture, isLoading }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError("Could not access camera. Please ensure permissions are granted.");
        console.error(err);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUri = canvasRef.current.toDataURL("image/jpeg");
        onCapture(dataUri);
      }
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-black aspect-video max-w-2xl mx-auto shadow-2xl border-4 border-white/10">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center">
          <RefreshCcw className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-white font-medium">{error}</p>
          <Button variant="link" className="text-primary" onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      )}

      {!error && (
        <div className="absolute inset-0 pointer-events-none border-[20px] border-black/20">
          <div className="w-full h-full border-2 border-dashed border-white/30 rounded-xl relative">
            {/* Corner brackets for scanning effect */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-primary" />
            
            {/* Scanning line animation */}
            {!isLoading && (
              <div className="absolute top-0 left-0 w-full h-0.5 bg-primary/50 animate-bounce opacity-50" />
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <Button 
          size="lg" 
          onClick={capture} 
          disabled={isLoading || !!error}
          className="rounded-full px-8 shadow-xl bg-primary hover:bg-primary/90 transition-transform active:scale-95"
        >
          {isLoading ? (
            <RefreshCcw className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Camera className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Processing..." : "Capture"}
        </Button>
      </div>
    </div>
  );
}