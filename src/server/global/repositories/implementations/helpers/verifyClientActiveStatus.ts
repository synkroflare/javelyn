import { Ticket } from "@prisma/client"
import { getDaysDifference } from "./getDaysDifference"

type TActiveData = {
  isActive: boolean
  daysSinceLastTicket: number
  dayDiffs: number[]
}

export const verifyClientActiveStatus = (clientInfo: any, treshold: number) => {
  const tickets = clientInfo.tickets
  const todayDate = new Date()

  let outerDayDiff = 0
  const activeData: TActiveData = {
    isActive: false,
    daysSinceLastTicket: 99999,
    dayDiffs: [],
  }

  for (let i = 0; i < tickets.length; i++) {
    const dayDiff = getDaysDifference(todayDate, tickets[i].doneDate)
    if (dayDiff < treshold) activeData.isActive = true
    outerDayDiff = dayDiff
    activeData.dayDiffs.push(dayDiff)
  }

  const sortedTickets = tickets.sort((a: Ticket, b: Ticket) => {
    if (b.doneDate && a.doneDate) {
      return new Date(b.doneDate).getTime() - new Date(a.doneDate).getTime()
    }
  })

  const rankName = getRankName(sortedTickets[0], sortedTickets[1])

  console.log(clientInfo.name + " Rank: " + rankName)

  return {
    isActive: activeData.isActive,
    daysSinceLastTicket: Math.min(...activeData.dayDiffs),
    rankName,
  }
}

const getRankName = (lastTicket: Ticket, preLastTicket: Ticket) => {
  if (!lastTicket) return "INDEFINIDO"
  if (!lastTicket.doneDate) {
    console.error("no date for ticket " + lastTicket.id)
    return "INDEFINIDO"
  }

  const daysSinceLastTicket = getDaysDifference(lastTicket.doneDate, new Date())

  if (!preLastTicket) {
    if (daysSinceLastTicket < 60) return "NOVO CLIENTE"
    if (daysSinceLastTicket < 150) return "A FIDELIZAR"
    if (daysSinceLastTicket > 150) return "RESGATE CLIENTE NOVO"
  }

  if (!preLastTicket.doneDate) {
    console.error("no date for ticket " + preLastTicket.id)
    return "INDEFINIDO"
  }

  const daysSincePreLastTicket = getDaysDifference(
    preLastTicket.doneDate,
    new Date()
  )

  if (daysSincePreLastTicket < 90 && daysSinceLastTicket < 60) return "MASTER"
  if (daysSincePreLastTicket < 180 && daysSinceLastTicket < 90) return "PREMIUM"
  if (daysSincePreLastTicket < 240 && daysSinceLastTicket < 120) return "SENIOR"
  if (daysSincePreLastTicket < 300 && daysSinceLastTicket < 150) return "JUNIOR"
  if (daysSinceLastTicket <= 150 && daysSincePreLastTicket >= 300)
    return "FIDELIZANDO"
  if (daysSinceLastTicket >= 150) return "RESGATE"
  return "INDEFINIDO"
}
