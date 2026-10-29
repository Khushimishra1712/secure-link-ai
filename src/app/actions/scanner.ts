"use server";

import { scanUrl } from "@/lib/scanner";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function submitUrlScan(url: string) {
  try {
    const session = await auth();
    const result = await scanUrl(url);

    const scan = await prisma.scan.create({
      data: {
        url: result.url,
        threatScore: result.threatScore,
        status: result.status,
        analysis: result.analysis as any,
        userId: session?.user?.id || null, // Allow anonymous if no session
      },
    });

    if (session?.user?.id) {
      await prisma.activityLog.create({
        data: {
          action: `Scanned URL: ${result.url}`,
          userId: session.user.id,
        },
      });
    }

    return { success: true, scanId: scan.id, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to scan URL" };
  }
}
