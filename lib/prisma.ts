// import { PrismaClient } from "@prisma/client";
// import { withOptimize } from "@prisma/extension-optimize";
// import { withPulse } from "@prisma/extension-pulse/node";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// // .$extends(
// //   withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
// // )
// const prisma = new PrismaClient().$extends(withPulse({
//   apiKey :process.env.PULSE_API_KEY!
// }));
// export default prisma;


// // async function main() {
// //   //   const stream = await prisma.notification.stream({ name: 'notification-stream'})
// //     const stream = await prisma.post.subscribe()
    
// //     for await (const event of stream) {
// //       console.log('New event:', event)
// //     }
// //   }
  
// //   main()
  
// //   const eventSource = new EventSource('/api/posts/subscribe');


import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma