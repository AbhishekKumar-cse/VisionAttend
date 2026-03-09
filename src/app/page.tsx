import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanFace, ShieldCheck, Zap, BarChart3, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ScanFace className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-headline">VisionAttend</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm font-medium" asChild>
              <Link href="/dashboard">Log In</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 rounded-full" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-[#F0F2F4] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6">
              <ShieldCheck className="w-3 h-3" />
              NEXT-GEN BIOMETRIC SECURITY
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#195DE5] leading-[1.1] font-headline mb-6">
              Seamless Attendance,<br />
              <span className="text-foreground">Powered by AI.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              VisionAttend combines cutting-edge facial recognition with robust Firestore integration to deliver a production-grade attendance ecosystem for the modern era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full bg-primary text-lg shadow-lg shadow-primary/25 group" asChild>
                <Link href="/dashboard/mark">
                  Start Scanning
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg bg-white border-2 hover:bg-secondary/50" asChild>
                <Link href="/dashboard/enroll">Enroll New Users</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background blobs for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -mr-64 -mt-32 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full -ml-32 -mb-32 blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold font-headline">Enterprise-Grade Performance</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built with architectural depth, scalability strategy, and production-ready configuration.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: ScanFace, title: "Face Recognition", desc: "Real-time AI verification ensures accurate and spoof-resistant identification." },
              { icon: Zap, title: "Real-time Dashboard", desc: "Instantly track presence, lateness, and absenteeism with live Firestore streams." },
              { icon: BarChart3, title: "Deep Analytics", desc: "Generate comprehensive reports and AI-powered insights for data-driven decisions." }
            ].map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t bg-[#F0F2F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <ScanFace className="text-white w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-primary">VisionAttend</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 NEX_GEN. Impact Driven Project (SP 2026). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Security</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}