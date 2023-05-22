import { container } from "tsyringe"
import cron from "node-cron"
import { PrismaClient } from "@prisma/client"
import { IClientRepository } from "../../server/global/repositories/IClientRepository"
import { IGroupRepository } from "../../server/global/repositories/IGroupRepository"
import { updatedGroups } from "./updateGroups"

export const cronJobs = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const prismaClient = container.resolve<PrismaClient>("PrismaClient")
      const clientRepository =
        container.resolve<IClientRepository>("ClientRepository")
      const groupRepository =
        container.resolve<IGroupRepository>("GroupRepository")
      // Your task to be executed every day at 00:00 goes here
      const companies = await prismaClient.company.findMany({
        include: {
          groups: {
            where: {
              statusTrashed: false,
            },
          },
        },
      })

      for (const company of companies) {
        console.log(`Cron-jobing for ${company.name}.`)
        const data = {
          treshold: company.activeClientTreshold,
          companyId: company.id,
        }
        clientRepository.handleActiveStatus(data)
        await updatedGroups({
          groups: company.groups,
          companyId: company.id,
        })
      }
    } catch (error: any) {
      console.error(error)
    }
  })
}
