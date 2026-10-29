import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding dummy data...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@securelink.ai' },
    update: {},
    create: {
      email: 'admin@securelink.ai',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'John Doe',
      password: userPassword,
      role: 'USER',
    },
  })

  await prisma.scan.createMany({
    data: [
      {
        url: 'https://google.com',
        threatScore: 0,
        status: 'Safe',
        userId: admin.id,
        analysis: {
          hasHTTPS: true,
          ipBased: false,
          urlLength: 18,
          suspiciousKeywords: [],
          recommendations: ['The URL appears to be safe based on basic security heuristics.'],
        },
      },
      {
        url: 'http://192.168.1.1/login.php',
        threatScore: 85,
        status: 'Dangerous',
        userId: admin.id,
        analysis: {
          hasHTTPS: false,
          ipBased: true,
          urlLength: 28,
          suspiciousKeywords: ['login'],
          recommendations: [
            'The connection is not encrypted (missing HTTPS). Avoid entering sensitive information.',
            'The URL uses an IP address instead of a domain name, which is highly suspicious.',
            'Suspicious keywords found in the URL: login'
          ],
        },
      },
      {
        url: 'https://secure-update-paypal.co.uk',
        threatScore: 50,
        status: 'Suspicious',
        userId: user.id,
        analysis: {
          hasHTTPS: true,
          ipBased: false,
          urlLength: 36,
          suspiciousKeywords: ['secure', 'update', 'paypal'],
          recommendations: [
            'Suspicious keywords found in the URL: secure, update, paypal'
          ],
        },
      },
      {
        url: 'https://apple-free-iphone-winner.com/verify',
        threatScore: 65,
        status: 'Dangerous',
        userId: user.id,
        analysis: {
          hasHTTPS: true,
          ipBased: false,
          urlLength: 43,
          suspiciousKeywords: ['free', 'verify'],
          recommendations: [
            'Suspicious keywords found in the URL: free, verify'
          ],
        },
      }
    ]
  })

  console.log('Dummy data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
