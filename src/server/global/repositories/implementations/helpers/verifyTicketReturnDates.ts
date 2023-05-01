import { PrismaClient } from "@prisma/client"
import { IClient } from "server/global/models/IClient"
import { getDaysDifference } from "./getDaysDifference"

export const verifyTicketReturnDates = async (
  clientData: IClient,
  prismaClient: PrismaClient
): Promise<void> => {
  await prismaClient.client.update({
    where: {
      id: clientData.id,
    },
    data: {
      statusAvailableToReturn: false,
    },
  })

  const tickets = await prismaClient.ticket.findMany({
    where: {
      clientName: clientData.name,
    },
    include: {
      procedures: true,
    },
  })
  const todayDate = new Date()

  const ticketsAbleToReturn: any = []

  for (let ticket of tickets) {
    if (!ticket.doneDate) continue

    await prismaClient.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        proceduresAvailableToReturn: {
          set: [],
        },
        statusAvailableToReturn: false,
      },
    })

    for (let procedure of ticket.procedures) {
      if (!procedure || !procedure.recommendedReturnTime) continue

      const dayDiff = getDaysDifference(ticket.doneDate, todayDate)
      const arrayIndex = veryifyProcedureDuplicates(
        dayDiff,
        procedure.id,
        ticketsAbleToReturn
      )

      if (arrayIndex === -2) continue
      if (arrayIndex !== -1) {
        if (dayDiff >= procedure.recommendedReturnTime) {
          ticketsAbleToReturn[arrayIndex] = {
            ticketId: ticket.id,
            procedureId: procedure.id,
            procedureName: procedure.name,
            procedureReturnTime: procedure.recommendedReturnTime,
            dayDiff: dayDiff,
            availableToReturn: true,
          }
          continue
        }
        ticketsAbleToReturn[arrayIndex] = {
          ticketId: ticket.id,
          procedureId: procedure.id,
          procedureName: procedure.name,
          procedureReturnTime: procedure.recommendedReturnTime,
          dayDiff: dayDiff,
          availableToReturn: false,
        }
        continue
      }

      if (dayDiff >= procedure.recommendedReturnTime) {
        ticketsAbleToReturn.push({
          ticketId: ticket.id,
          procedureId: procedure.id,
          procedureName: procedure.name,
          procedureReturnTime: procedure.recommendedReturnTime,
          dayDiff: dayDiff,
          availableToReturn: true,
        })
        continue
      }
      ticketsAbleToReturn.push({
        ticketId: ticket.id,
        procedureId: procedure.id,
        procedureName: procedure.name,
        procedureReturnTime: procedure.recommendedReturnTime,
        dayDiff: dayDiff,
        availableToReturn: false,
      })
    }
  }

  const filteredTickets = ticketsAbleToReturn.filter((ticket) => {
    if (ticket.availableToReturn) {
      return ticket
    }
  })

  if (clientData.name === "ZILDA MENDONCA MARQUES") {
    console.log(filteredTickets)
  }

  handlePrismaUpdates(filteredTickets, clientData, prismaClient)
}

const veryifyProcedureDuplicates = (
  dayDiff: number,
  procedureId: number,
  array: any[]
) => {
  const firstCheckIndex = array
    .map(function (e) {
      return e.procedureId
    })
    .indexOf(procedureId)

  if (firstCheckIndex === -1) return -1

  if (array[firstCheckIndex].dayDiff < dayDiff) {
    return -2
  }

  return firstCheckIndex
}

const handlePrismaUpdates = async (
  tickets: any,
  clientData: any,
  prismaClient: PrismaClient
) => {
  if (tickets.length === 0) return

  for (let i = 0; i < tickets.length; i++) {
    await prismaClient.ticket.update({
      where: {
        id: tickets[i].ticketId,
      },
      data: {
        statusAvailableToReturn: true,
        proceduresAvailableToReturn: {
          connect: {
            id: tickets[i].procedureId,
          },
        },
      },
    })
  }

  await prismaClient.client.update({
    where: {
      id: clientData.id,
    },
    data: {
      statusAvailableToReturn: true,
    },
  })
}
