import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, ShieldAlert, ShieldCheck, Link as LinkIcon, Globe, Info, Download, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ScanResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const scan = await prisma.scan.findUnique({
    where: { id },
  });

  if (!scan) {
    notFound();
  }

  const analysis: any = scan.analysis;

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">SecureLink AI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Scan Report</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="w-4 h-4" />
              <span className="truncate max-w-lg">{scan.url}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/api/export?type=txt&scanId=${scan.id}`} target="_blank">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-card/60 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Threat Score</CardTitle>
              <CardDescription>AI Confidence Rating</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6">
              <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" className="stroke-white/10 stroke-[10] fill-none" />
                  <circle cx="80" cy="80" r="70" 
                    className={`stroke-[10] fill-none ${
                      scan.status === "Safe" ? "stroke-green-500" :
                      scan.status === "Suspicious" ? "stroke-yellow-500" : "stroke-red-500"
                    }`}
                    strokeDasharray="440"
                    strokeDashoffset={440 - (440 * scan.threatScore) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-bold">{scan.threatScore}</span>
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
              <Badge className="mt-6 text-lg px-4 py-1" variant={
                scan.status === "Safe" ? "secondary" : 
                scan.status === "Suspicious" ? "default" : "destructive"
              }>
                {scan.status}
              </Badge>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-card/60 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle>Security Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Protocol Security</p>
                      <p className="text-sm text-muted-foreground">Checks for valid SSL/TLS certificate</p>
                    </div>
                  </div>
                  {analysis.hasHTTPS ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Secure (HTTPS)</Badge>
                  ) : (
                    <Badge variant="destructive">Insecure (HTTP)</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">URL Structure</p>
                      <p className="text-sm text-muted-foreground">Length and IP-based checks</p>
                    </div>
                  </div>
                  {analysis.ipBased ? (
                    <Badge variant="destructive">IP Based</Badge>
                  ) : analysis.urlLength > 100 ? (
                    <Badge variant="destructive">Unusually Long</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Standard</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Keyword Analysis</p>
                      <p className="text-sm text-muted-foreground">Detects phishing keywords</p>
                    </div>
                  </div>
                  {analysis.suspiciousKeywords?.length > 0 ? (
                    <Badge variant="destructive">{analysis.suspiciousKeywords.length} Detected</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Clean</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.recommendations?.length > 0 ? (
              <ul className="space-y-3">
                {analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    {scan.status === "Safe" ? (
                      <ShieldCheck className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
                    )}
                    <span className={scan.status === "Safe" ? "text-muted-foreground" : "text-foreground"}>
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No specific recommendations at this time.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
