import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "csv";
  const scanId = searchParams.get("scanId");

  if (!scanId) {
    return new NextResponse("Missing scanId", { status: 400 });
  }

  const scan = await prisma.scan.findUnique({
    where: { id: scanId, userId: session.user.id },
  });

  if (!scan) {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (type === "csv") {
    const csvContent = `URL,Threat Score,Status,Created At\n${scan.url},${scan.threatScore},${scan.status},${scan.createdAt}`;
    
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="scan-report-${scan.id}.csv"`,
      },
    });
  } else {
    const txtContent = `SECURELINK AI - SCAN REPORT\n\nURL: ${scan.url}\nThreat Score: ${scan.threatScore}/100\nStatus: ${scan.status}\nDate: ${scan.createdAt}\n\nAnalysis:\n${JSON.stringify(scan.analysis, null, 2)}`;
    
    return new NextResponse(txtContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="scan-report-${scan.id}.txt"`,
      },
    });
  }
}
