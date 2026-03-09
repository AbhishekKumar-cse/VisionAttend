import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ShieldCheck, Zap, BarChart3, ArrowRight, School, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <School className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary font-headline">EduAttend AI</span>
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
              SECURE CAMPUS VERIFICATION
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-[#195DE5] leading-[1.1] font-headline mb-6">
              AI-Driven Campus<br />
              <span className="text-foreground">Attendance.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              EduAttend AI replaces manual rolls with seamless facial recognition. Specialized for higher education, tracking students and faculty with enterprise-grade security.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full bg-primary text-lg shadow-lg shadow-primary/25 group" asChild>
                <Link href="/dashboard/mark">
                  Start Scanning
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg bg-white border-2 hover:bg-secondary/50" asChild>
                <Link href="/dashboard/enroll">Enroll Students/Faculty</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -mr-64 -mt-32 blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold font-headline">Designed for Modern Campuses</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Scalable biometric solution for schools and colleges with deep academic insights.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: GraduationCap, title: "Student Lifecycle", desc: "Track attendance from Freshman to Senior year with automated academic reporting." },
              { icon: Users, title: "Faculty Management", desc: "Monitor professor clock-ins and departmental presence in real-time." },
              { icon: BarChart3, title: "Dean's Reports", desc: "AI-powered summaries of student punctuality and departmental performance." }
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
              <School className="text-white w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-primary">EduAttend AI</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Academic Vision Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
