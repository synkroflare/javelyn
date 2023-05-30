import { Client, PrismaClient } from "@prisma/client"
import { container } from "tsyringe"

export const handlePrismaContainer = async () => {
  const prisma = new PrismaClient()
  container.registerInstance<PrismaClient>("PrismaClient", prisma)

  /* const users = await prisma.user.findMany({
    where: {
      OR: [{ id: 24 }, { id: 16 }, { id: 14 }],
      AND: {
        companyId: 1,
      },
    },
  })

  const clients = await prisma.client.findMany({
    where: {
      companyId: 1,
    },
  })

  let count = 0

  const promiseArray: Promise<Client>[] = []

  for (const client of clients) {
    const promise = prisma.client.update({
      where: {
        id: client.id,
      },
      data: {
        responsibleUserId: users[count].id,
      },
    })
    promiseArray.push(promise)
    if (count == 2) {
      count = 0
      continue
    }
    count++
  }

  await Promise.all(promiseArray)
  console.log("done") */
}
