"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { submitUrlScan } from "@/app/actions/scanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Activity, Lock, AlertTriangle, ArrowRight, Loader2, Globe, Server, Zap, CheckCircle2, Search, Database, Users, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function LandingPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    startTransition(async () => {
      const res = await submitUrlScan(url);
      if (res.success && res.scanId) {
        router.push(`/scan/${res.scanId}`);
      } else {
        toast.error(res.error || "Failed to scan URL");
      }
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">SecureLink AI</span>
            </div>
            <div className="flex items-center gap-6 hidden md:flex">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</Link>
              <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Statistics</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Log in
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8 py-24 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            <span>Advanced Threat Intelligence Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Analyze URLs for <br className="hidden md:block" />
            <span className="text-primary">Malicious Threats</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly detect phishing, malware, and typosquatting domains using our AI-driven heuristics and real-time security analysis.
          </p>

          <form onSubmit={handleScan} className="max-w-2xl mx-auto mt-10 relative flex items-center shadow-2xl">
            <div className="absolute left-4 text-muted-foreground">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type="text"
              placeholder="https://example.com"
              className="pl-12 pr-32 h-16 text-lg rounded-2xl bg-card/80 border-white/10 backdrop-blur-md focus-visible:ring-primary/50"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              size="lg" 
              className="absolute right-2 rounded-xl h-12 px-6"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : "Scan URL"}
              {!isPending && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-12">
            <div className="space-y-2">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="font-semibold text-lg">Real-time Analysis</h3>
              <p className="text-muted-foreground text-sm">Scan URLs instantly for known signatures and heuristic patterns.</p>
            </div>
            <div className="space-y-2">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
              <h3 className="font-semibold text-lg">Phishing Detection</h3>
              <p className="text-muted-foreground text-sm">Identify fake login pages and typosquatting domains protecting your credentials.</p>
            </div>
            <div className="space-y-2">
              <Activity className="w-6 h-6 text-blue-500" />
              <h3 className="font-semibold text-lg">Detailed Reports</h3>
              <p className="text-muted-foreground text-sm">Get comprehensive security reports with actionable recommendations.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-card/30 relative overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">12M+</h4>
              <p className="text-muted-foreground font-medium">URLs Scanned</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">99.9%</h4>
              <p className="text-muted-foreground font-medium">Detection Accuracy</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">3.2M</h4>
              <p className="text-muted-foreground font-medium">Threats Blocked</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-4xl font-bold text-primary">24/7</h4>
              <p className="text-muted-foreground font-medium">Real-time Protection</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How SecureLink AI Works</h2>
            <p className="text-muted-foreground text-lg">Our multi-layered approach ensures no malicious link goes undetected. We analyze structural anomalies and match against global threat feeds.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. Submit URL</h3>
              <p className="text-muted-foreground">Input any link into our scanner. The system instantly begins resolving the domain and fetching structural metadata.</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. AI Heuristic Analysis</h3>
              <p className="text-muted-foreground">Our engine checks for missing encryption, IP-based domains, excessive redirects, and phishing keywords like "verify" or "secure".</p>
            </div>

            <div className="relative p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Actionable Report</h3>
              <p className="text-muted-foreground">Receive a Threat Score out of 100 with clear recommendations. Export the report as a PDF/CSV to share with your security team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Cyber Defense</h2>
              <p className="text-muted-foreground text-lg">SecureLink AI is designed for enterprises and individuals who demand the highest level of link security. From zero-day phishing campaigns to deeply nested malicious payloads, our system uncovers what standard tools miss.</p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-medium">Sub-second response times</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="font-medium">Global cross-referencing with active threat databases</span>
                </li>
                <li className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-primary" />
                  <span className="font-medium">Persistent scan history and analytics dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">Role-based access control for team administration</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full max-w-md bg-background rounded-2xl border border-white/10 p-6 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 blur-2xl rounded-full" />
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">Dangerous URL Blocked</h4>
                    <p className="text-xs text-muted-foreground">Just now • Phishing Attempt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">Suspicious Domain</h4>
                    <p className="text-xs text-muted-foreground">2 mins ago • Typosquatting</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold">Safe Connection</h4>
                    <p className="text-xs text-muted-foreground">5 mins ago • Valid SSL Confirmed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold tracking-tight">SecureLink AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SecureLink AI Platform. All rights reserved. (Demo Project)
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
