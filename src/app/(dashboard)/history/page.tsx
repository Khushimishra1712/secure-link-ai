import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HistoryPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
        <Link href="/">
          <Button>Scan New URL</Button>
        </Link>
      </div>

      <Card className="bg-card/60 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle>All Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No scan history found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="font-medium max-w-[200px] truncate" title={scan.url}>
                      {scan.url}
                    </TableCell>
                    <TableCell>{new Date(scan.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-secondary rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              scan.threatScore <= 30 ? "bg-green-500" :
                              scan.threatScore <= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${scan.threatScore}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{scan.threatScore}/100</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={scan.status === "Safe" ? "secondary" : scan.status === "Suspicious" ? "default" : "destructive"}>
                        {scan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/scan/${scan.id}`}>
                        <Button variant="ghost" size="sm">View Report</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
