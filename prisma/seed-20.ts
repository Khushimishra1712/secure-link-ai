import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding 20 dummy scans...')
  const user = await prisma.user.findUnique({ where: { email: 'user@example.com' } })
  if (!user) throw new Error("User not found")

  const statuses = ["Safe", "Suspicious", "Dangerous"] as const;
  
  for (let i = 0; i < 20; i++) {
    const score = Math.floor(Math.random() * 100);
    let status: typeof statuses[number];
    if (score <= 30) status = "Safe";
    else if (score <= 60) status = "Suspicious";
    else status = "Dangerous";

    await prisma.scan.create({
      data: {
        url: `https://dummy-site-${i}.com/${Math.random().toString(36).substring(7)}`,
        threatScore: score,
        status: status,
        userId: user.id,
        analysis: {
          hasHTTPS: score < 50,
          ipBased: score > 80,
          urlLength: 20 + Math.floor(Math.random() * 50),
          suspiciousKeywords: score > 60 ? ["login", "verify"] : [],
          recommendations: score > 60 ? ["Suspicious keywords detected"] : ["Appears safe"],
        },
      }
    });
  }
  console.log('20 dummy scans added!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
