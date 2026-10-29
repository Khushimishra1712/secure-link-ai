import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, ShieldCheck, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const totalScans = scans.length;
  const safeScans = scans.filter(s => s.status === "Safe").length;
  const suspiciousScans = scans.filter(s => s.status === "Suspicious").length;
  const dangerousScans = scans.filter(s => s.status === "Dangerous").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <Link href="/">
          <Button>Scan New URL</Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalScans}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Safe URLs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeScans}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Suspicious URLs</CardTitle>
            <Shield className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspiciousScans}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Dangerous URLs</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dangerousScans}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Scans</CardTitle>
            <Link href="/history" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scans.slice(0, 5).map((scan) => (
                <Link href={`/scan/${scan.id}`} key={scan.id} className="block group">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0 group-hover:bg-white/5 p-2 rounded-md transition-colors">
                    <div className="space-y-1 overflow-hidden pr-4 flex-1">
                      <p className="text-sm font-medium leading-none truncate">{scan.url}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(scan.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                      scan.status === "Safe" ? "bg-green-500/10 text-green-500" :
                      scan.status === "Suspicious" ? "bg-yellow-500/10 text-yellow-500" :
                      "bg-red-500/10 text-red-500"
                    }`}>
                      {scan.status}
                    </div>
                  </div>
                </Link>
              ))}
              {scans.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No scans yet. Try scanning a URL!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
